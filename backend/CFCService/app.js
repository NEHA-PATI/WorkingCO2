const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

const requestLogger = require('./src/middlewares/requestLogger');
app.use(requestLogger);
const rateLimiter = require('./src/middlewares/rateLimiter');
app.use(rateLimiter);
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;