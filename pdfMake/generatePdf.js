const getDocDefinition = require("./docDefinition");
const pdfMake = require("pdfmake/build/pdfmake");
const vfsFonts = require("pdfmake/build/vfs_fonts");
const hostel = require("../Models/hostel");

const generatePdf = (hostelName, date, users) => {
    pdfMake.vfs = vfsFonts.pdfMake.vfs;

    const docDefinition = getDocDefinition(hostelName, date, users);
    const pdfDoc = pdfMake.createPdf(docDefinition);

    pdfDoc.getBase64(async (data) => {
        const buffer = Buffer.from(data, "base64");
        const Hostel = await hostel.findOne(
            { name: hostelName },
            { users: 0, upload: 0 }
        );
        Hostel.result = buffer;
        await Hostel.save();
    });
};

// const users = [];
// let roll = 1704310000;
// for (let i = 0; i < 1000; i++) {
//     users.push([roll, "G90"]);
//     roll++;
// }
// generatePdf("vrindavan hostel", "11/10/2020", users);

module.exports = generatePdf;
