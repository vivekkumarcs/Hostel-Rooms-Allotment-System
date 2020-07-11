const temp = require("../Models/temporary");
const todaysAllotment = require("./todaysAllotment");
const vacantRoomCalculation = require("../helpers/vacantRoomCalculation");
const user = require("../Models/user");

// Round-2 preference filling starts

// 1. get all the hostels from todaysAllotment.js
// 2. find the users who applied for Round-2 or who doesnot get any room in round-1
// 3. remove their details from result if they got room in round-1
// 4. calculate the vacant rooms for round-2
// 5. make their editable to true

const _1pm = async () => {
    const Hostels = await todaysAllotment();
    const match = {
        $or: [{ result: { $eq: "" } }, { nextRound: { $eq: true } }],
    };
    for (const Hostel of Hostels) {
        const ids = Hostel.users.map((id) => id);

        const tmpData = await temp.findOne({ name: Hostel.name });
        let data = JSON.parse(tmpData.data);

        await Hostel.populate({
            path: "users",
            match,
        }).execPopulate();

        let users = Hostel.users;
        for (const User of users) {
            if (User.result) {
                data[User.result] = data[User.result].filter(
                    (detail) => detail[0] !== User.rollNo
                );
            }
        }
        let rooms = "";
        Object.keys(data).forEach((key) => {
            if (data[key].length < Hostel.capacity) {
                rooms += key;
                rooms += ",";
            }
        });
        rooms = rooms.slice(0, rooms.length - 1);

        const vacantRooms = vacantRoomCalculation(rooms);
        vacantRooms.forEach((detail, index) => {
            vacantRooms[index].rooms = detail.rooms.map((room) => {
                const roomNo = detail.prefix + room;
                const vacant = Hostel.capacity - data[roomNo].length;
                return [room, vacant];
            });
        });
        Hostel.vacantRooms = JSON.stringify(vacantRooms);
        Hostel.disabledRooms = JSON.stringify([]);

        Hostel.round = 2;
        await Hostel.save();

        for (const User of users) {
            User.preferences = [];
            User.round = 2;
            User.result = null;
            User.disabledQuota = false;
            User.editable = true;
            await User.save();
        }

        await user.updateMany(
            {
                _id: { $in: ids },
                round: { $eq: 1 },
            },
            { round: 4 }
        );

        tmpData.data = JSON.stringify(data);
        await tmpData.save();
    }
};

module.exports = _1pm;
