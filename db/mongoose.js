const mongoose = require("mongoose");
const hostelCode = require("../Models/hostelcode");
url = "mongodb://127.0.0.1:27017/hostel-allotment-database";
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const addNew = async () => {
    let x = await hostelCode.findOne({});
    if (!x) {
        x = new hostelCode({
            hostelCode: 20200,
        });
        await x.save();
    }
};
addNew();
