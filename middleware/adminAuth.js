const admin = require("../Models/admin");
const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.SECRET_KEY1);
        const Admin = await admin.findOne({
            _id: decoded._id,
            tokens: { $in: token },
        });
        if (!Admin) throw new Error("please login to access this route");

        req.User = Admin;
        next();
    } catch (e) {
        res.status(401).send({ error: "please login to access this route" });
    }
};

module.exports = adminAuth;
