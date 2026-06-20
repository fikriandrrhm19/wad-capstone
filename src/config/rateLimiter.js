const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Terlalu banyak request dari IP ini. Coba lagi dalam 15 menit.',
        },
    },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        error: {
            code: 'TOO_MANY_ATTEMPTS',
            message: 'Terlalu banyak percobaan login. Tunggu 15 menit.',
        },
    },
});

const sensitiveLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        error: { 
            code: 'TOO_MANY_REQUESTS', 
            message: 'Batas request sensitif tercapai. Silakan coba lagi nanti.' 
        }
    },
});

module.exports = { 
    apiLimiter, 
    authLimiter, 
    sensitiveLimiter 
};