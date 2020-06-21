const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    hostels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hostel",
        },
    ],
    tokens: [{ type: String }],
});

adminSchema.pre("save", async function (next) {
    const User = this;
    if (User.isModified("password"))
        User.password = await bcrypt.hash(User.password, 8);
    next();
});

module.exports = mongoose.model("admin", adminSchema);
