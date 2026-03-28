const User = require('./user.model');
const Otp = require('./otp.model');
const { generateOTP, generateJwt } = require('../../utils/auth-utils');

const login = async (mobileNumber) => {
    let user = await User.findOne({ mobileNumber });

    if (!user) {
        user = await User.create({
            mobileNumber,
            isOnboarded: false,
        });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await Otp.create({
        mobileNumber,
        code: otpCode,
        expiresAt,
    });

    // Mock sending OTP
    console.log(`OTP for ${mobileNumber} is ${otpCode}`);

    return { success: true };
};

const verifyOtp = async (mobileNumber, otp) => {
    const latestOtp = await Otp.findOne({
        mobileNumber,
        code: otp,
        expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!latestOtp) {
        const error = new Error('Invalid or expired OTP');
        error.status = 401;
        throw error;
    }

    const user = await User.findOne({ mobileNumber });

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    // Delete all OTPs for this mobile number after successful login
    await Otp.deleteMany({ mobileNumber });

    const token = generateJwt({ userId: user._id });

    return {
        user,
        token,
        onboarding_required: !user.isOnboarded,
    };
};

const onboardUser = async (userId, data) => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            ...data,
            isOnboarded: true,
        },
        { new: true }
    );

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    return user;
};

module.exports = {
    login,
    verifyOtp,
    onboardUser,
};
