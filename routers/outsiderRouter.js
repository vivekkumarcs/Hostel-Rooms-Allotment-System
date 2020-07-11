const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otp = require("../Models/otp");
const user = require("../Models/user");
const admin = require("../Models/admin");
const hostel = require("../Models/hostel");
const validator = require("validator");
const { sendEmail } = require("../email/email");
const validate = require("../helpers/passwordValidation");
const getCurrentLocalTime = require("../helpers/currentLocalTime");
const router = express.Router();

router.get("/getNotification", async (req, res) => {
    const todaysDate = getCurrentLocalTime();
    const upcoming = todaysDate + 5 * 24 * 3600 * 1000;
    const alloted = todaysDate - 3 * 24 * 3600 * 1000;

    const Hostels = await hostel.find(
        {
            $or: [
                {
                    editable: { $eq: false },
                    Date: { $lte: upcoming },
                },
                {
                    editable: { $eq: true },
                    round: { $eq: 3 },
                    Date: { $gt: alloted },
                },
            ],
        },
        { name: 1, editable: 1, Date: 1, _id: 0 }
    );
    res.send(Hostels);
});

router.post("/signup", async (req, res) => {
    try {
        if (req.body.uniqueKey !== process.env.UNIQUE_KEY)
            throw new Error("401");
        validate(req.body.password);
        const newUser = new admin({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        });
        await newUser.save();
        const token = jwt.sign(
            { _id: newUser._id.toString() },
            process.env.SECRET_KEY1,
            {
                expiresIn: "7d",
            }
        );
        newUser.tokens.push(token);
        await newUser.save();
        const { password, tokens, hostels, ...remaining } = newUser.toObject();
        remaining.inbox = [];
        res.status(201).send({ User: remaining, admin: true, token: token });
    } catch (e) {
        console.log(e);
        if (e.message === "401") res.status(401).send();
        else res.status(400).send({ error: e.message });
    }
});

router.post("/signin", async (req, res) => {
    try {
        let User;
        if (req.body.userid) {
            User = await user.findOne({ userid: req.body.userid });
        } else {
            User = await admin.findOne({ email: req.body.email.toLowerCase() });
        }

        const isMatch = await bcrypt.compare(req.body.password, User.password);

        if (!isMatch) throw new Error("incorrect username or password");

        const token = jwt.sign(
            { _id: User._id.toString() },
            process.env.SECRET_KEY1,
            {
                expiresIn: "7d",
            }
        );
        User.tokens.push(token);
        await User.save();
        if (req.body.userid) {
            // for User
            const Hostel = await hostel.findById(User.hostelid);
            User = User.toObject();
            User.hostelName = Hostel.name;
            User.Date = Hostel.Date;
            User.roomCapacity = Hostel.capacity;
            User.roomRange = Hostel.roomRange;
            User.disabledRoomRange = Hostel.disabledRoomRange;
            if (Hostel.editable) User.Date = null;
            if (User.editable) {
                User.vacantRooms = Hostel.vacantRooms;
                if (User.disabled) User.disabledRooms = Hostel.disabledRooms;
            }
            const { password, tokens, ...remaining } = User;
            User = remaining;
        } else {
            // for admin
            await User.populate({
                path: "hostels",
                select: {
                    name: 1,
                },
                match: {
                    round: { $eq: 3 },
                },
                options: {
                    sort: {
                        Date: 1,
                    },
                },
            }).execPopulate();

            const { password, hostels, tokens, ...remaining } = User.toObject();
            remaining.inbox = User.hostels.map((hostel) => hostel.name);
            User = remaining;
        }
        res.send({ User, admin: !req.body.userid, token: token });
    } catch (e) {
        console.log(e);
        res.status(400).send({ error: "username or password is incorrect" });
    }
});

router.post("/forgetPassword", async (req, res) => {
    try {
        if (!req.body.email || !validator.isEmail(req.body.email))
            throw new Error();

        const User = await admin.findOne({
            email: req.body.email.toLowerCase(),
        });

        if (!User) throw new Error();
        let tmp = await otp.findOne(
            { email: req.body.email.toLowerCase() },
            {},
            {
                sort: { createdAt: -1 },
                limit: 1,
            }
        );
        do {
            if (tmp) {
                const created = tmp.createdAt.getTime();
                const now = Date.now();

                let timeSpent = Math.ceil((now - created) / 1000);
                if (timeSpent < 150 && !tmp.verified) {
                    await sendEmail(
                        tmp.email,
                        "Password Reset",
                        `${tmp.OTP} is One Time Password. This is valid for 120 seconds.`,
                        ""
                    );

                    res.send({ sent: true });
                    break;
                }
            }
            const s = "1234567890";
            let OTP = "";
            OTP += s[Math.floor(Math.random() * 9)];
            for (let i = 0; i < 5; i++) {
                OTP += s[Math.floor(Math.random() * 10)];
            }
            OTP = parseInt(OTP);
            tmp = new otp({ email: req.body.email.toLowerCase(), OTP: OTP });
            await tmp.save();

            await sendEmail(
                tmp.email,
                "Password Reset",
                `${tmp.OTP} is One Time Password. This is valid for 120 seconds.`,
                ""
            );

            res.send({ sent: true });
        } while (false);
    } catch (e) {
        console.log(e);
        res.send({ sent: false });
    }
});
router.post("/otpVerify", async (req, res) => {
    try {
        const tmp = await otp.findOne(
            { email: req.body.email.toLowerCase() },
            {},
            {
                sort: { createdAt: -1 },
                limit: 1,
            }
        );
        if (!tmp || tmp.OTP !== req.body.OTP || tmp.verified) throw new Error();

        const created = tmp.createdAt.getTime();
        const now = Date.now();

        let timeSpent = Math.ceil((now - created) / 1000);
        if (timeSpent > 150) throw new Error();
        tmp.verified = true;
        await tmp.save();
        res.send({ verified: true });
    } catch (e) {
        res.status(400).send({ verified: false });
    }
});

router.post("/changePassword", async (req, res) => {
    try {
        if (!req.body.newPassword || !req.body.email) throw new Error();
        const tmp = await otp.findOne(
            { email: req.body.email.toLowerCase() },
            {},
            {
                sort: { createdAt: -1 },
                limit: 1,
            }
        );
        if (!tmp || !tmp.verified) throw new Error();

        const User = await admin.findOne({
            email: req.body.email.toLowerCase(),
        });
        User.password = req.body.newPassword;
        await User.save();
        tmp.verified = false;
        await tmp.save();
        res.send();
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;
