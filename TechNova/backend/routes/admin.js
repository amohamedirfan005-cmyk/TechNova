const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        const admin = rows[0];
        
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: admin.id, role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: 'Logged in successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB Error: ' + err.message + ' | Stack: ' + err.stack.split('\n')[0] });
    }
});

module.exports = router;
