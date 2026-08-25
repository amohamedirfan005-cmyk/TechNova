# TechNova - College Event Management System

TechNova is a full-stack web application designed for managing college technical events. It features an attractive landing page, event registration, a robust admin dashboard, and participant login functionality.

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (requires zero setup)
- **Authentication**: JWT & bcrypt

## Project Structure
```text
TechNova/
├── frontend/             # Static files (HTML, CSS, JS)
│   ├── pages/            # Landing page
│   ├── admin/            # Admin login & dashboard
│   ├── participant/      # Participant login
│   ├── css/              # Stylesheets
│   ├── js/               # Frontend logic
├── backend/              # Node.js backend API
│   ├── controllers/      
│   ├── routes/           # API endpoints (admin, events, participant)
│   ├── middleware/       # Auth middleware
│   ├── config/           # Database config
│   └── server.js         # Entry point
├── database/             
│   └── schema.sql        # Database schema
├── .env.example          # Environment variables template
└── package.json          
```

## Setup Instructions

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
(By default, the `.env` file is already created for you with a development secret).

### 3. Start the Application
Start the backend server, which will also serve the frontend files:
```bash
npm start
```
The server will start on `http://localhost:3000`.

### 4. Database Initialization
The SQLite database (`database/technova.sqlite`) is created automatically the first time you start the server. The tables and a default admin user are populated based on `database/schema.sql`.

## Testing the Flows

### Admin Flow
1. Navigate to `http://localhost:3000/admin/login.html`
2. Login with credentials:
   - **Email**: `admin@technova.com`
   - **Password**: `admin123`
3. In the dashboard, you can view registrations and click "Start Event" to enable participant login for specific events.

### User Registration Flow
1. Navigate to `http://localhost:3000`
2. Click "Register" on an event card.
3. Fill out the form and submit. (If email fails to send in dev mode, check your server console or you can still see the generated credentials in the Admin Dashboard under "Registered Participants").

### Participant Flow
1. The participant receives an email with their Participant ID and Temporary Password.
2. Navigate to `http://localhost:3000/participant/login.html`
3. If the Admin has not clicked "Start Event" for the participant's event, the login will display: "Events are not started yet."
4. Once the Admin starts the event, the participant can successfully log in.

## Deployment Preparation
To deploy to a service like Render or Heroku:
- Change the SQLite database to a PostgreSQL or MySQL hosted database.
- Provide proper environment variables for `EMAIL_USER`, `EMAIL_PASSWORD`, and `JWT_SECRET`.
