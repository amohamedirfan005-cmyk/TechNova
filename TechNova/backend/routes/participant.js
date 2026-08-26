const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(`
            SELECT er.*, e.status as event_status, e.name as event_name 
            FROM event_registrations er
            JOIN users u ON er.user_id = u.id
            JOIN events e ON er.event_id = e.id
            WHERE u.email = ?
        `, [email]);
        
        const row = rows[0];
        
        if (!row) return res.status(401).json({ message: 'Invalid credentials or not registered.' });
        
        // Verify password
        const isMatch = await bcrypt.compare(password, row.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        // Check if event is started
        if (row.event_status !== 'Started') {
            return res.status(403).json({ message: 'Events are not started yet.' });
        }

        const jwtSecret = process.env.JWT_SECRET || 'technova_secret_key_2026';
        const token = jwt.sign({ participantId: row.participant_id, eventId: row.event_id, role: 'PARTICIPANT' }, jwtSecret, { expiresIn: '1d' });
        res.json({ token, message: 'Logged in successfully', eventName: row.event_name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB Err' });
    }
});

module.exports = router;
