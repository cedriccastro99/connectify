import express from "express";
import cors from "cors";

//routes
import routes from '../app/routes/index.js';

// MongoDB connection
import { connectDB } from './db.js';

const initializeApp = (app) => {

    // Connect to MongoDB
    connectDB();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // Log each request to the console
    app.use((req, res, next) => {
        // Log each request using the logger
        log.info(`${req.method} ${req.url}`);
        next();
    });

    // Load routes from the routes folder
    if (routes && routes.length > 0) {
        routes.forEach(route => {
            app.use(route.path, route.route);
        });
    }

    //ERROR HANDLERS

    // for endpoint not found
    app.use((req, res, next) => {
        log.error(`404 - Invalid URL - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        const error = new Error('Invalid URL');
        error.status = 404;
        next(error);
    });

    // for handling errors
    app.use((error, req, res, next) => {
        log.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(error.status || 500);
        res.json({
            data: null,
            success: false,
            message: error.message || 'Internal Server Error'
        });
    });

    return app;
}

export default initializeApp;