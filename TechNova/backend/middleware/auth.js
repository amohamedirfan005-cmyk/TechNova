const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err || user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

module.exports = { authenticateAdmin };
