const user = require("../Models/user");
const temp = require("../Models/temporary");
const todaysAllotment = require("../allotment/todaysAllotment");
const allotmentWithoutPreferences = require("./allotmentWithoutPreferences");

const runAllotment = async (Hostel, data, disabled) => {
    const capacity = Hostel.capacity;

    let Users = Hostel.users.filter((User) =>
        disabled ? User.disabledQuota : !(User.disabled && User.disabledQuota)
    );

    const notAlloted = [];
    for (const User of Users) {
        let i;
        for (i = 0; i < User.preferences.length; i++) {
            if (
                !data[User.preferences[i]] ||
                data[User.preferences[i]].length >= capacity
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
    if (disabled) {
        await allotmentWithoutPreferences(Hostel, data, notAlloted, false);
    }
};

const _11am = async () => {
    let Hostels = await todaysAllotment();
    // locking the preferences of user
    for (const Hostel of Hostels) {
        await user.updateMany(
            { _id: { $in: Hostel.users } },
            { editable: false }
        );
    }
    //populating all hostels users field
    Hostels = Hostels.map(
        async (Hostel) =>
            await Hostel.populate({
                path: "users",
                options: {
                    sort: {
                        rank: 1,
                    },
                },
            }).execPopulate()
    );
    Hostels = await Promise.all(Hostels);
    //making allotment for all hostels one by one
    let data;
    for (const Hostel of Hostels) {
        data = {};
        const vacant = JSON.parse(Hostel.vacantRooms);
        vacant.forEach((detail) => {
            detail.rooms.forEach(
                (roomNo) => (data[detail.prefix + roomNo.toString()] = [])
            );
        });

        await runAllotment(Hostel, data, true);
        await runAllotment(Hostel, data, false);
        //console.log(data);
        let Temp = await temp.findOne({ name: Hostel.name });
        if (Temp) {
            Temp.data = JSON.stringify(data);
        } else {
            Temp = new temp({
                name: Hostel.name,
                data: JSON.stringify(data),
            });
        }
        await Temp.save();
    }
};
module.exports = _11am;
