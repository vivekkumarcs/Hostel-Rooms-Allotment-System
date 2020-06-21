const mongoose = require("mongoose");
const validation = require("../helpers/roomValidation.js");
const hostelSchema = new mongoose.Schema({
    hostelCode: Number,
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    wrapAround: {
        type: Boolean,
        default: true,
    },
    roomRange: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            validation.roomValidation(value);
        },
    },
    disabledRoomRange: {
        type: String,
        trim: true,
        validate(value) {
            if (value) validation.roomValidation(value);
        },
        default: null,
    },
    Date: {
        type: Number,
        default: null,
    },
    uploaded: {
        type: Boolean,
        default: false,
    },
    editable: {
        type: Boolean,
        default: true,
    },
    round: {
        type: Number,
        default: 0,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

    vacantRooms: {
        type: String,
    },
    disabledRooms: {
        type: String,
    },

    // vacantRooms: [
    //     {
    //         prefix: String,
    //         rooms: [{ type: Number }],
    //         _id: false,
    //     },
    // ],
    // disabledRooms: [
    //     {
    //         prefix: String,
    //         rooms: [{ type: Number }],
    //         _id: false,
    //     },
    // ],
    result: {
        type: Buffer,
    },
});
hostelSchema.pre("findOneAndUpdate", function (next) {
    this.options.runValidators = true;
    next();
});
module.exports = mongoose.model("hostel", hostelSchema);
