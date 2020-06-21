const mongoose = require("mongoose");
const hostelCodeSchema = new mongoose.Schema({
    hostelCode: Number,
});
module.exports = mongoose.model("hostelCode", hostelCodeSchema);
