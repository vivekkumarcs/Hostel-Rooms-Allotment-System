const user = require("../Models/user");
const todaysAllotment = require("../allotment/todaysAllotment");
const vacantRoomCalculation = require("../helpers/vacantRoomCalculation");

const calculate = (roomRange, disabledRoomRange) => {
    const data = {};
    data.disabledRooms = [];
    data.vacantRooms = vacantRoomCalculation(roomRange);
    if (!disabledRoomRange) return data;
    const disabledRooms = vacantRoomCalculation(disabledRoomRange);
    const newdisabledRooms = [];
    for (let i = 0; i < data.vacantRooms.length; i++) {
        for (let j = 0; j < disabledRooms.length; j++) {
            if (data.vacantRooms[i].prefix === disabledRooms[j].prefix) {
                let rooms = data.vacantRooms[i].rooms.filter((room) =>
                    disabledRooms[j].rooms.includes(room)
                );
                if (rooms.length > 0) {
                    newdisabledRooms.push({
                        prefix: disabledRooms[j].prefix,
                        rooms: rooms,
                    });
                }
            }
        }
    }
    data.disabledRooms = newdisabledRooms;
    return data;
};

const _8am = async () => {
    const Hostels = await todaysAllotment();

    for (const Hostel of Hostels) {
        const data = calculate(Hostel.roomRange, Hostel.disabledRoomRange);
        Hostel.vacantRooms = JSON.stringify(data.vacantRooms);
        Hostel.disabledRooms = JSON.stringify(data.disabledRooms);
        Hostel.round = 1;
        await Hostel.save();
        await user.updateMany(
            { _id: { $in: Hostel.users } },
            { editable: true, round: 1 }
        );
    }
};
module.exports = _8am;
