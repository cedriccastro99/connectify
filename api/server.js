import 'dotenv/config';
import express from 'express';
import initializeApp from './config/index.js';
import log from './utils/logger.js';

//Global variables
global.log = log

// Initialize express app
const app = initializeApp(express());
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
})