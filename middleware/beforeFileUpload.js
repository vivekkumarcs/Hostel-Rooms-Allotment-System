const hostel = require("../Models/hostel");
const beforeFileUpload = async (req, res, next) => {
    try {
        const Hostel = await hostel.findOne(
            {
                _id: req.params.hostelid,
                admin: req.User._id,
            },
            { result: 0 }
        );
        if (!Hostel || !Hostel.editable) throw new Error();
        req.Hostel = Hostel;
        next();
    } catch (e) {
        res.status(400).send("from beforFileUpload");
    }
};
module.exports = beforeFileUpload;
