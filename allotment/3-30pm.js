const temp = require("../Models/temporary");
const hostel = require("../Models/hostel");
const generatePDF = require("../pdfMake/generatePdf");
const todaysAllotment = require("../allotment/todaysAllotment");

const _330pm = async () => {
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

        await Hostel.populate({
            path: "users",
            // match: { round: { $eq: 2 } },
        }).execPopulate();

        for (const User of Hostel.users) {
            User.round = 2;
            User.result = URmap[User.rollNo] ? URmap[User.rollNo] : "";
            await User.save();
        }

        // Hostel.round = 3;
        Hostel.editable = true;
        await Hostel.save();
    }

    // to generate pdf
    for (const Hostel of Hostels) {
        let hostelData = await hostel.findOne({ _id: Hostel._id }).populate({
            path: "users",
            options: {
                sortby: {
                    rollNo: 1,
                },
            },
        });

        let users = hostelData.users.map((user) => [user.rollNo, user.result]);
        users.sort((a, b) =>
            a[1].localeCompare(b[1], undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );

        let d = new Date(hostelData.Date);
        let date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        await generatePDF(Hostel.name, date, users);

        for (User of hostelData.users) {
            User.round = 3;
            await User.save();
        }

        Hostel.round = 3;
        await Hostel.save();
    }
};
module.exports = _330pm;
