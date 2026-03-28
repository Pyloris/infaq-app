require('dotenv').config();

const config = {
    port: process.env.PORT || 4000,
    db: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'supersecret',
        expiresIn: '7d',
    },
};

module.exports = config;
