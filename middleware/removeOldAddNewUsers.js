const user = require("../Models/user");

const removeOldAddNewUsers = async (req, res, next) => {
    try {
        await user.deleteMany({ _id: { $in: req.Hostel.users } });
        const code = req.Hostel.hostelCode;
        let password = "00000000";
        const Users = await req.Users.map(async (User, index) => {
            let nth = (index + 1).toString();

            let x = code.toString() + nth;

            if (nth.length < 4) {
                x = (code * 10 ** (4 - nth.length)).toString() + nth;
            }
            let newUser = new user({
                userid: parseInt(x),
                rollNo: User.rollNo,
                name: User.name,
                rank: parseInt(User.rank),
                password: password,
                disabled: User.disabled.toLowerCase() === "true",
                email: User.email,
                hostelid: req.params.hostelid,
                disabledQuota: User.disabled.toLowerCase() === "true",
            });
            await newUser.save();
            return newUser._id;
        });

        const ids = await Promise.all(Users);

        req.Hostel.users = ids;
        await req.Hostel.save();

        next();
    } catch (e) {
        console.log(e);
        res.status(400).send("from remove old add new Users");
    }
};
module.exports = removeOldAddNewUsers;
