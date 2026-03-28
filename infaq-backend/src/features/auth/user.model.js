const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            default: null,
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
