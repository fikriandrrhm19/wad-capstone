const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticate = (req, res, next) => {
    // 1. Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    // Format yang diharapkan: 'Bearer eyJhbGci...'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                code: 'MISSING_TOKEN',
                message: 'Access token diperlukan.',
                details: [
                    { target: 'authorization', issue: 'Sertakan header format: Authorization: Bearer <token>' }
                ]
            },
        });
    }
    const token = authHeader.split(' ')[1]; // Ambil bagian setelah 'Bearer'
    try {
        // 2. Verifikasi signature dan expiry
        const payload = jwt.verify(token, config.jwt.accessSecret);
        // 3. Tambahkan informasi user ke request untuk digunakan controller
        req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };
        next();
    } catch (err) {
        // jwt.verify melempar error jika token invalid atau expired
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Access token sudah expired.',
                    details: [
                        { target: 'token', issue: 'Masa berlaku access token habis. Gunakan refresh token untuk memperbarui sesi.' }
                    ]
                },
            });
        }
        return res.status(401).json({
            error: {
                code: 'INVALID_TOKEN',
                message: 'Access token tidak valid.',
                details: [
                    { target: 'token', issue: 'Tanda tangan (signature) token rusak atau tidak cocok dengan secret key server.' }
                ]
            },
        });
    }
};

module.exports = authenticate;