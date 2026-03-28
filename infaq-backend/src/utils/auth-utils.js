const jwt = require('jsonwebtoken');
const config = require('../config/app-config');

const generateOTP = () => {
    // Generate a 6-digit random code (mock for now as per requirements)
    return '4444';
};

const generateJwt = (payload, expiresIn = config.jwt.expiresIn) => {
    return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

const verifyJwt = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        const err = new Error('Invalid or expired token');
        err.status = 401;
        throw err;
    }
};

const decodeJwt = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateOTP,
    generateJwt,
    verifyJwt,
    decodeJwt,
};
