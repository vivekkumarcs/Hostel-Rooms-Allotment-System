// this module is to fetch the hostels whoose allotments are scheduled today

const hostel = require("../Models/hostel");
const getCurrentLocalTime = require("../helpers/currentLocalTime");

const todaysAllotment = async () => {
    const todaysDate = getCurrentLocalTime();
    console.log(todaysDate);
    const Hostels = await hostel.find({ Date: todaysDate }, { result: 0 });
    // console.log(Hostels);
    return Hostels;
};
// todaysAllotment();

module.exports = todaysAllotment;
