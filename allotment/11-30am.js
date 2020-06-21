const user = require("../Models/user");
const temp = require("../Models/temporary");
const todaysAllotment = require("../allotment/todaysAllotment");

const _1130am = async () => {
    const Hostels = await todaysAllotment();
    for (const Hostel of Hostels) {
        const tmpData = await temp.findOne({ name: Hostel.name });
        let data = JSON.parse(tmpData.data);
        let URmap = {};
        Object.keys(data).forEach((key) => {
            data[key].forEach((detail) => {
                URmap[detail[0]] = key;
            });
        });
        for (const id of Hostel.users) {
            let User = await user.findById(id);
            User.result = URmap[User.userid] ? URmap[User.userid] : "";
            await User.save();
        }
    }
};
module.exports = _1130am;
