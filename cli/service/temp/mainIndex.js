'use strict';

const packageJson = require('./package.json');
process.env.APP_VERSION = packageJson.version;

require('dotenv').config();
require('app-module-path').addPath(__dirname + '/app');

const sirexjs = require('sirexjs');
// const router = require('core/router');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const routes = require('routes/index');
const cors = require('cors');

// TODO Refactor mongoDB connection
// const mongodb = require('core/databases/mongodb');

const app = express();
// router.setRouter(express.Router());
sirexjs.databas.mongodb.connect();

// Inject extentions
Object.assign(app, sirexjs.extensions());

// Setup app to use CORS
app.use(cors());

//
app.use(bodyParser.json()); // support json encoded bodies

app.use(fileUpload()); // Upload files

// Custom response for all reoutes
app.use(restResponse.setResponse);

// Load routing
app.use('/', routes);

app.listen(process.env.APP_PORT, function() {
  logger.info(`${process.env.APP_NAME} v${process.env.APP_VERSION} running on port ${process.env.APP_PORT}`);
  logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
});
