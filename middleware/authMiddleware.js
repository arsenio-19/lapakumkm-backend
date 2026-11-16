const jwt = require('jsonwebtoken');

// AUTHENTICATE TOKEN
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Token tidak ditemukan.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token tidak valid atau sudah kedaluwarsa.'
        });
    }
};

// AUTHORIZE ROLE
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Kamu tidak memiliki izin untuk mengakses fitur ini.'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};