const express = require("express");
const bcrypt = require("bcryptjs");
const hostel = require("../Models/hostel");
const userAuth = require("../middleware/userAuth");
const validate = require("../helpers/passwordValidation");
const router = express.Router();

//1. get user information
router.get("/", userAuth, async (req, res) => {
    let User = req.User.toObject();
    if (User.editable) {
        const Hostel = await hostel.findById(User.hostelid);
        User.vacantRooms = Hostel.vacantRooms;
        if (User.disabled) User.disabledRooms = Hostel.disabledRooms;
    }
    const { password, tokens, ...remaining } = User;
    User = remaining;
    res.send(User);
});
// 2. to add preferences
router.post("/preferences", userAuth, async (req, res) => {
    try {
        if (!req.User.editable) {
            res.status(406).send({ errmsg: "portal has been closed" });
        } else {
            const updates = [
                "disabledQuota",
                "preferences",
                "referee",
                "referral",
            ];
            updates.forEach((key) => {
                if (Object.keys(req.body).includes(key)) {
                    req.User[key] = req.body[key];
                }
            });
            await req.User.save();
            res.send(req.User);
        }
    } catch {
        res.status(400).send({ errmsg: "something went wrong" });
    }
});

// 3. to change password
router.patch("/changePassword", userAuth, async (req, res) => {
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

//4. apply for next round
router.get("/apply", userAuth, async (req, res) => {
    try {
        req.User.nextRound = true;
        await req.User.save();
        res.send();
    } catch (e) {
        res.status(400).send({ errmsg: "something went wrong" });
    }
});

// 5. to logout from account
router.get("/logout", userAuth, async (req, res) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        await req.User.updateOne({ $pull: { tokens: token } });
        res.send();
    } catch (e) {
        res.status(400).send({ errmsg: "something went wrong" });
    }
});

module.exports = router;
