const { verifyJwt } = require('../utils/auth-utils');
const catchError = require('../errors/catch-error');

const protect = catchError(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new Error('Not authorized to access this route');
        error.status = 401;
        throw error;
    }

    const decoded = verifyJwt(token);
    req.user = { id: decoded.userId };
    next();
});

module.exports = { protect };
