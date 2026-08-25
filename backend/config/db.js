const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'technova',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true, // needed if we run schema.sql which has multiple statements
    ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined
});

const promisePool = pool.promise();

// Check connection and ensure schema
promisePool.getConnection()
    .then(async (connection) => {
        console.log('Connected to MySQL database.');
        
        try {
            const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf-8');
            await connection.query(schema);
            console.log('Database schema ensured.');
        } catch (err) {
            console.error('Error executing schema on startup (this is okay if tables already exist):', err.message);
        }
        
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err.message);
    });

module.exports = promisePool;
