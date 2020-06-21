const mongoose = require("mongoose");

const tempSchema = new mongoose.Schema({
    name: String,
    data: String,
});

module.exports = mongoose.model("temporary", tempSchema);
