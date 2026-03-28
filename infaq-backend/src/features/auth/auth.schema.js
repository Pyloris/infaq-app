const { z } = require('zod');

const loginSchema = z.object({
    mobile_number: z.string()
        .trim()
        .min(10, 'Invalid mobile number')
        .max(15, 'Invalid mobile number')
        .transform(val => val.replace(/\s+/g, '')),
});

const verifyOtpSchema = z.object({
    mobile_number: z.string()
        .trim()
        .min(10, 'Invalid mobile number')
        .max(15, 'Invalid mobile number')
        .transform(val => val.replace(/\s+/g, '')),
    otp: z.string()
        .trim()
        .length(4, 'OTP must be 4 digits'),
});

const onboardUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2, 'Name must be at least 2 characters'),
    email: z.string()
        .trim()
        .email('Invalid email address')
        .toLowerCase(),
});

module.exports = {
    loginSchema,
    verifyOtpSchema,
    onboardUserSchema,
};
