const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();

// Ensure environment variables are set
if (!process.env.PORT || !process.env.MONGO_URL) {
    console.error("Missing environment variables. Ensure PORT and DB_URL are set in .env");
    process.exit(1);
}

const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// Routes
readdirSync('./routes').map((route) => {
    console.log(`Loading route: ${route}`);
    app.use('/api/v1', require('./routes/' + route));
});

// Start Server
const server = () => {
    db(); // Connect to the database
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
};

server();
