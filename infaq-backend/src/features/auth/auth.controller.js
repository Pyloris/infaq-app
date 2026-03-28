const authService = require('./auth.service');
const { loginSchema, verifyOtpSchema, onboardUserSchema } = require('./auth.schema');
const catchError = require('../../errors/catch-error');

const login = catchError(async (req, res) => {
    const validatedData = loginSchema.parse(req.body);
    await authService.login(validatedData.mobile_number);

    res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        data: null,
    });
});

const verifyOtp = catchError(async (req, res) => {
    const validatedData = verifyOtpSchema.parse(req.body);
    const result = await authService.verifyOtp(validatedData.mobile_number, validatedData.otp);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token: result.token,
            user: result.user,
            onboarding_required: result.onboarding_required,
        },
    });
});

const onboardUser = catchError(async (req, res) => {
    const validatedData = onboardUserSchema.parse(req.body);
    const user = await authService.onboardUser(req.user.id, validatedData);

    res.status(200).json({
        success: true,
        message: 'User onboarded successfully',
        data: { user },
    });
});

module.exports = {
    login,
    verifyOtp,
    onboardUser,
};
