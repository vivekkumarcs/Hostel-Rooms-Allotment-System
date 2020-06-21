const user = require("../Models/user");
const temp = require("../Models/temporary");
const todaysAllotment = require("./todaysAllotment");
const allotmentWithoutPreferences = require("./allotmentWithoutPreferences");

//1. make editable false for Users who applied for round 2
//2. allot the users the rooms based on their preferences who applied for round 2

const runAllotment = async (Hostel) => {
    await Hostel.populate({
        path: "users",
        match: {
            round: { $eq: 2 },
        },
        options: {
            sort: {
                rank: 1,
            },
        },
    }).execPopulate();

    const tmpData = await temp.findOne({ name: Hostel.name });

    const data = JSON.parse(tmpData.data);

    const notAlloted = [];

    for (const User of Hostel.users) {
        let i;
        for (i = 0; i < User.preferences.length; i++) {
            if (
                !data[User.preferences[i]] ||
                data[User.preferences[i]].length >= Hostel.capacity
            ) {
                continue;
            } else {
                data[User.preferences[i]].push([User.rollNo, User.rank]);
                break;
            }
        }
        if (i === User.preferences.length) {
            notAlloted.push(User);
        }
    }
    await allotmentWithoutPreferences(Hostel, data, notAlloted, true);

    tmpData.data = JSON.stringify(data);
    await tmpData.save();
};

const _3pm = async () => {
    const Hostels = await todaysAllotment();

    for (const Hostel of Hostels) {
        await user.updateMany(
            { _id: { $in: Hostel.users }, editable: { $eq: true } },
            { editable: false }
        );
    }

    for (const Hostel of Hostels) {
        await runAllotment(Hostel);
    }
};

module.exports = _3pm;
