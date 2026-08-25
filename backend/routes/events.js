const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    family: 4, // Force IPv4 to prevent ENETUNREACH on Render
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Register for an event
router.post('/register', async (req, res) => {
    const { fullName, college, email, mobile, dob, event } = req.body;
    
    try {
        // Find the event ID
        const [eventRows] = await db.query('SELECT id FROM events WHERE name = ?', [event]);
        const eventRow = eventRows[0];
        if (!eventRow) return res.status(404).json({ message: 'Event not found' });
        
        const eventId = eventRow.id;
        
        // Check if user exists, else create
        const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        let userId;
        
        if (userRows.length > 0) {
            userId = userRows[0].id;
        } else {
            const [result] = await db.query('INSERT INTO users (name, college, email, mobile, dob) VALUES (?, ?, ?, ?, ?)', [fullName, college, email, mobile, dob]);
            userId = result.insertId;
        }
        
        // Check if already registered
        const [regRows] = await db.query('SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?', [userId, eventId]);
        if (regRows.length > 0) return res.status(400).json({ message: 'You are already registered for this event.' });
        
        // Generate Participant ID and temporary password
        const participantId = `TN26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const tempPassword = crypto.randomBytes(4).toString('hex');
        const passwordHash = await bcrypt.hash(tempPassword, 10);
        
        await db.query('INSERT INTO event_registrations (user_id, event_id, participant_id, password_hash) VALUES (?, ?, ?, ?)', [userId, eventId, participantId, passwordHash]);
        
        // Send email
        try {
            await transporter.sendMail({
                from: '"TechNova" <noreply@technova.com>',
                to: email,
                subject: 'TechNova Event Registration',
                text: `Hello ${fullName},\n\nYou have successfully registered for ${event}.\n\nYour Login Email: ${email}\nYour Participant ID: ${participantId}\nYour Temporary Password: ${tempPassword}\n\nPlease keep these credentials safe. You will need your Email and Temporary Password to log in when the event starts.\n\nBest regards,\nTechNova Team`
            });
            console.log(`Email sent to ${email} with password: ${tempPassword}`);
        } catch (emailErr) {
            console.error('Failed to send email:', emailErr);
        }
        
        res.json({ message: 'Registration successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all events (Admin)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'DB Err' });
    }
});

// Update event status (Admin)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE events SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Event status updated' });
    } catch (err) {
        res.status(500).json({ message: 'DB Err' });
    }
});

// Get dashboard stats (Admin)
router.get('/stats', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.name as event_name, COUNT(er.id) as registrations 
            FROM events e 
            LEFT JOIN event_registrations er ON e.id = er.event_id 
            GROUP BY e.id
        `);
        
        const [totalRows] = await db.query('SELECT COUNT(*) as total FROM event_registrations');
        
        res.json({
            total: totalRows[0].total,
            events: rows
        });
    } catch (err) {
        res.status(500).json({ message: 'DB Err' });
    }
});

// Get all registered participants (Admin)
router.get('/participants', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT er.participant_id, u.name, u.college, u.email, u.mobile, u.dob, e.name as event_name, er.registered_at, er.registration_status
            FROM event_registrations er
            JOIN users u ON er.user_id = u.id
            JOIN events e ON er.event_id = e.id
            ORDER BY er.registered_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'DB Err' });
    }
});

// Delete registered participant (Admin)
router.delete('/participants/:participant_id', authenticateAdmin, async (req, res) => {
    const { participant_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM event_registrations WHERE participant_id = ?', [participant_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Participant not found' });
        }
        res.json({ message: 'Participant registration deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB Err' });
    }
});

module.exports = router;
