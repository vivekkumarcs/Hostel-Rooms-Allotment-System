const user = require("../Models/user");
const vacantRoomCalculation = require("../helpers/vacantRoomCalculation");

const allotmentWithoutPreferences = async (Hostel, data, Users, normal) => {
    if (Users.length === 0) return;

    const roomList = normal
        ? vacantRoomCalculation(Hostel.roomRange)
        : JSON.parse(Hostel.disabledRooms);

    const capacity = Hostel.capacity;

    let roomRank = [];
    for (const detail of roomList) {
        for (const room of detail.rooms) {
            let roomNo = detail.prefix + room;
            if (data[roomNo].length < capacity) {
                let rank = 0;
                if (data[roomNo].length > 0) {
                    rank = Math.min(data[roomNo].map((x) => x[1]));
                }
                roomRank.push([roomNo, rank]);
            }
        }
    }

    if (roomRank.length > 0) {
        roomRank.sort((a, b) => a[1] - b[1]);
        for (const r of roomRank) {
            while (data[r[0]].length < capacity && Users.length > 0) {
                let User = Users.shift();
                data[r[0]].push([User.rollNo, User.rank]);
            }
            if (Users.length === 0) break;
        }
    }

    console.log("hi1");
    if (!normal) return;
    if (Users.length === 0) return;
    console.log("hi2");
    if (!Hostel.wrapAround) return;

    let remainingUsers = [];

    const URmap = {};
    Object.keys(data).forEach((key) => {
        data[key].forEach((detail) => {
            URmap[detail[0]] = key;
        });
    });

    for (const User of Users) {
        if (User.referee !== "") {
            if (
                URmap[User.referee] &&
                data[URmap[User.referee]].length <= capacity
            ) {
                const referral = await user.findOne({
                    rollNo: User.referee,
                    hostelid: Hostel._id,
                });
                if (referral && referral.referral == User.rollNo) {
                    data[URmap[User.referee]].push([User.rollNo, User.rank]);
                } else {
                    remainingUsers.push(User);
                }
            }
        } else {
            remainingUsers.push(User);
        }
    }

    if (remainingUsers.length === 0) return;

    roomRank = [];
    for (const detail of roomList) {
        for (const room of detail.rooms) {
            let roomNo = detail.prefix + room;
            let rank = 0;
            rank = Math.min(data[roomNo].map((x) => x[1]));
            roomRank.push([roomNo, rank]);
        }
    }

    const total_users = Users.length;
    const total_rooms = roomRank.length;
    const x = total_users / total_rooms;
    let y = total_users - Math.floor(x) * total_rooms;

    roomRank.sort((a, b) => b[1] - a[1]);
    remainingUsers.reverse();

    let j = 0;

    while (remainingUsers.length !== 0) {
        if (y === 0) {
            while (data[roomRank[j][0]].length < capacity + Math.floor(x)) {
                data[roomRank[j][0]].push([
                    remainingUsers[0].rollNo,
                    remainingUsers[0].rank,
                ]);
                remainingUsers.shift();
            }
            j++;
        } else {
            while (data[roomRank[j][0]].length < capacity + Math.ceil(x)) {
                data[roomRank[j][0]].push([
                    remainingUsers[0].rollNo,
                    remainingUsers[0].rank,
                ]);
                remainingUsers.shift();
            }
            j++;
            y--;
        }
    }
};
module.exports = allotmentWithoutPreferences;
