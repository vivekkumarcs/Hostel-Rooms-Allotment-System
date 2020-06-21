const user = require("../Models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.SECRET_KEY1);
        const User = await user.findOne({
            _id: decoded._id,
            tokens: { $in: token },
        });
        if (!User) throw new Error();
        req.User = User;
        next();
    } catch (e) {
        res.status(401).send({ error: "please login to access this route" });
    }
};

module.exports = userAuth;
