const express = require('express');
const cors = require('cors');

const appMiddleware = require('./middlewares/middleware'); // Middleware
const appRouter = require('./routes/router'); // Router
const errorHandler = require('./middlewares/errorHandler');

// Server
const app = express();

// Middleware
appMiddleware(app);
app.options('*', cors());

// Router
appRouter(app);

// Error Handler
app.use(errorHandler);

module.exports = app;
