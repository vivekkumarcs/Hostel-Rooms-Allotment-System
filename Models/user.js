const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    userid: {
        type: Number,
        unique: true,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    rank: {
        type: Number,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    round: {
        type: Number,
        default: 0,
    },
    result: {
        type: String,
        default: "",
    },
    editable: {
        type: Boolean,
        default: false,
    },
    disabledQuota: {
        type: Boolean,
        default: false,
    },
    referral: {
        type: String,
        default: "",
    },
    referee: {
        type: String,
        default: "",
    },
    nextRound: {
        type: Boolean,
        default: false,
    },
    hostelid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hostel",
        required: true,
    },
    preferences: [{ type: String }],
    tokens: [{ type: String }],
});
userSchema.pre("save", async function (next) {
    const User = this;
    if (User.isModified("password"))
        User.password = await bcrypt.hash(User.password, 8);
    next();
});

module.exports = mongoose.model("user", userSchema);
