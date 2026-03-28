const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const globalErrorHandler = require('./middlewares/global-error-handler');
const initCrons = require('./crons/main');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Initialize Background Crons
initCrons();

// Routes
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// 404 Handler
app.all(/.*/, (req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});

// Centralized error handling
app.use(globalErrorHandler);

module.exports = app;
