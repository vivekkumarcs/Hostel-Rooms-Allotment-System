const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: String,
        OTP: Number,
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { updatedAt: false },
    }
);

module.exports = mongoose.model("otp", otpSchema);
