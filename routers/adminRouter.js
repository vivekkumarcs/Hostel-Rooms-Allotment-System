const express = require("express");
const bcrypt = require("bcryptjs");
const user = require("../Models/user");
const hostel = require("../Models/hostel");
const hostelCode = require("../Models/hostelcode");
const upload = require("../middleware/multerFileUpload");
const adminAuth = require("../middleware/adminAuth");
const { sendUserDetails, sendBulk } = require("../email/email");
const validateCSV = require("../middleware/validateCSV");
const validate = require("../helpers/passwordValidation");
const randomPassword = require("../helpers/randomPassword");
const beforeFileUpload = require("../middleware/beforeFileUpload");
const removeOldAddNewUsers = require("../middleware/removeOldAddNewUsers");
const getCurrentLocalTime = require("../helpers/currentLocalTime");

const router = express.Router();

// 1. get admin
router.get("/", adminAuth, async (req, res) => {
    try {
        await req.User.populate({
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
        const newUser = req.User.toObject();
        newUser.inbox = newUser.hostels.map((hostel) => hostel.name);
        const { password, hostels, tokens, ...remaining } = newUser;
        res.send(remaining);
    } catch (e) {
        res.status(400).send();
    }
});
// 2. to change password of admin
router.patch("/changePassword", adminAuth, async (req, res) => {
    try {
        const isMatchOld = await bcrypt.compare(
            req.body.oldPassword,
            req.User.password
        );
        if (!isMatchOld) throw new Error();
        validate(req.body.newPassword);
        req.User.password = req.body.newPassword;
        await req.User.save();
        res.send(req.User);
    } catch (e) {
        res.status(400).send({ errmsg: "something went wrong" });
    }
});

// 3. to logout the admin
router.get("/logout", adminAuth, async (req, res) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        await req.User.updateOne({ $pull: { tokens: token } }, { new: true });
        res.send();
    } catch (e) {
        res.status(400).send({ errmsg: "something went wrong" });
    }
});

// 4. to add new hostel
router.post("/hostel", adminAuth, async (req, res) => {
    try {
        const code = await hostelCode.findOne({});

        const Hostel = new hostel({
            hostelCode: code.hostelCode,
            name: req.body.hostelName,
            capacity: req.body.roomCapacity,
            wrapAround: req.body.wrapAround,
            roomRange: req.body.roomRange,
            disabledRoomRange: req.body.disabledRoomRange,
            admin: req.User._id,
        });
        code.hostelCode += 1;
        await Hostel.save();
        await code.save();

        // adding hostelid to the array of hostels in admin collection
        await req.User.updateOne({ $push: { hostels: Hostel._id } });

        res.send(Hostel);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// 5. to get list of all hostels
router.get("/hostels", adminAuth, async (req, res) => {
    try {
        let match = {};
        if (req.query.final) {
            match = { editable: { $eq: false } };
        }
        await req.User.populate({
            path: "hostels",
            select: {
                admin: 0,
                result: 0,
                round: 0,
                vacantRooms: 0,
                disabledRooms: 0,
            },
            match,
            options: {
                sort: {
                    name: 1,
                },
            },
        }).execPopulate();

        const Hostels = req.User.hostels.map((Hostel) => {
            let newHostel = Hostel.toObject();
            newHostel.users = newHostel.users.length;
            return newHostel;
        });
        res.send(Hostels);
    } catch (e) {
        res.status(400).send({ error: "something went wrong" });
    }
});

// 6. to update hostel details
router.patch("/:hostelid", adminAuth, async (req, res) => {
    try {
        const allowedUpdates = {
            hostelName: "name",
            wrapAround: "wrapAround",
            roomRange: "roomRange",
            roomCapacity: "capacity",
            disabledRoomRange: "disabledRoomRange",
        };
        const update = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates[key]) {
                update[allowedUpdates[key]] = req.body[key];
            }
        });
        const Hostel = await hostel.findOneAndUpdate(
            { _id: req.params.hostelid, admin: req.User._id, editable: true },
            update,
            { new: true }
        );
        if (!Hostel) throw new Error();
        res.send();
    } catch (e) {
        res.status(400).send({ error: "something went wrong" });
    }
});

// 7. to delete hostel by its id
router.delete("/:hostelid", adminAuth, async (req, res) => {
    try {
        //finding the hostel from hostel collection
        let Hostel = await hostel.findOne(
            {
                _id: req.params.hostelid,
                admin: req.User._id,
                editable: true,
            },
            { result: 0 }
        );

        //deleting all users belonging to this hostel
        await user.deleteMany({ _id: { $in: Hostel.users } });

        //deleting the hostel from hostel collection
        await hostel.deleteOne({ _id: Hostel._id });

        //removing the id of hostel from hostels array of admin
        await req.User.updateOne(
            {
                $pull: { hostels: req.params.hostelid },
            },
            { new: true }
        );

        res.send();
    } catch (e) {
        res.status(400).send({ error: "something went wrong" });
    }
});

// 8. to fetch the users of corresponding hostel
router.get("/:hostelid/users", adminAuth, async (req, res) => {
    try {
        const match = {};
        const sort = {};
        if (req.query.name) {
            // match.name = new RegExp("^" + req.query.name.trim());
            match.name = req.query.name.trim();
        }
        if (req.query.rollNo) {
            //match.userid = new RegExp("^" + req.query.userid.trim());
            match.rollNo = req.query.rollNo.trim();
        }
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        }
        const Hostel = await hostel
            .findOne(
                { _id: req.params.hostelid, admin: req.User._id },
                { result: 0 }
            )
            .populate({
                path: "users",
                select: {
                    round: 0,
                    result: 0,
                    editable: 0,
                    password: 0,
                    preferences: 0,
                },
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            });
        res.send(Hostel.users);
    } catch (e) {
        res.status(400).send({ error: "something went wrong" });
    }
});

// 9. to update the details of user of corresponding hostel
router.patch("/:hostelid/:uid", adminAuth, async (req, res) => {
    try {
        const Hostel = await hostel.findOne(
            {
                _id: req.params.hostelid,
                admin: req.User._id,
                Date: { $ne: getCurrentLocalTime() },
                users: { $in: req.params.uid },
            },
            { result: 0, users: 0 }
        );
        if (!Hostel) throw new Error();

        if (req.body.reset) {
            req.body.password = randomPassword(8);
        }
        const allowedUpdates = [
            "name",
            "email",
            "password",
            "rank",
            "disabled",
        ];
        const keys = Object.keys(req.body);
        const User = await user.findById(req.params.uid);
        allowedUpdates.forEach((key) => {
            if (keys.includes(key)) {
                User[key] = req.body[key];
            }
        });
        await User.save();
        console.log(req.body.password);
        // sending password to registered email if password is resetted
        if (req.body.reset) {
            await sendUserDetails(
                User.email,
                User.userid,
                req.body.password,
                User.name
            );
        }
        res.send(User);
    } catch (e) {
        res.status(400).send({ error: "from updating details of users" });
    }
});

// 10. to upload the CSV file
router.post(
    "/:hostelid/upload",
    adminAuth,
    beforeFileUpload,
    upload.single("upload"),
    validateCSV,
    removeOldAddNewUsers,
    async (req, res) => {
        try {
            req.Hostel.uploaded = true;
            req.Hostel.round = 0;
            await req.Hostel.save();
            res.send(req.Users);
        } catch (e) {
            res.status(400).send({
                error: "uploading the CSV/ from adminRouter",
            });
        }
    },
    (error, req, res, next) => {
        res.status(400).send("from multer");
    }
);

// 11. to final submit the hostel details
router.post("/:hostelid/finalSubmit", adminAuth, async (req, res) => {
    try {
        if (!req.body.Date) {
            throw new Error("please provide date");
        }

        const todaysDate = getCurrentLocalTime();
        const providedDate = new Date(req.body.Date).setHours(0, 0, 0, 0);

        // if (providedDate <= todaysDate) {
        //     throw new Error("Date must be greater than current Date");
        // }

        const Hostel = await hostel.findOneAndUpdate(
            {
                _id: req.params.hostelid,
                editable: true,
                uploaded: true,
                admin: req.User._id,
            },
            { Date: providedDate, editable: false, round: 0 },
            { new: true }
        );
        if (!Hostel) {
            throw new Error(
                "please upload the CSV first / date has already submitted"
            );
        }
        const users = await Hostel.populate({
            path: "users",
        }).execPopulate();
        // console.log(users);
        const personalizations = [];
        for (User of users.users) {
            let password = randomPassword(8);
            User.password = password;
            User.round = 0;
            User.preferences = [];
            User.result = null;
            await User.save();
            personalizations.push({
                to: User.email,
                substitutions: {
                    name: User.name,
                    userid: User.userid,
                    password: password,
                },
            });
            // sendUserDetails(User.email, User.userid, password, User.name);
        }
        // console.log(personalizations);
        sendBulk(personalizations);
        res.send();
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// 12. to discard the final submit
router.get("/:hostelid/discard", adminAuth, async (req, res) => {
    try {
        const Hostel = await hostel.findByIdAndUpdate(
            { _id: req.params.hostelid, admin: req.User._id },
            { Date: null, editable: true },
            { new: true }
        );
        res.send();
    } catch (e) {
        res.status(400).send({ error: "something went wrong" });
    }
});

// 13. to get the result of a hostel of admin
router.get("/result", async (req, res) => {
    try {
        if (!req.query.hostelName) throw new Error();

        const Hostel = await hostel.findOne(
            {
                name: req.query.hostelName,
                // admin: req.User._id,
            },
            { users: 0 }
        );

        res.set("Content-Type", "application/pdf");
        res.set("Content-Length", Hostel.result.length);
        res.set(
            "Content-Disposition",
            `attachment; filename=${req.query.hostelName}-result.pdf`
        );

        res.send(Hostel.result);
    } catch (e) {
        console.log({ path: "/admin/result", error: e });
        res.status(400).send({ error: "data not found" });
    }
});

module.exports = router;
