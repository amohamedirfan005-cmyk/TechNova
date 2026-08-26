const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied' });
    
    const jwtSecret = process.env.JWT_SECRET || 'technova_secret_key_2026';
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err || user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

module.exports = { authenticateAdmin };
