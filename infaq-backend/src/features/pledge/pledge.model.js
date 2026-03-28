const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        frequency: {
            type: String,
            enum: ['one-time', 'monthly', 'yearly'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'pending', 'stopped'],
            default: 'pending',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Pledge = mongoose.model('Pledge', pledgeSchema);
module.exports = Pledge;
