// TechNova Server v1.0.2 - Updated DNS and Credentials
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db'); // Initialize DB

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const adminRoutes = require('./routes/admin');
const eventsRoutes = require('./routes/events');
const participantRoutes = require('./routes/participant');

app.use('/api/admin', adminRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/participant', participantRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Placeholder for API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'TechNova API is running' });
});

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
