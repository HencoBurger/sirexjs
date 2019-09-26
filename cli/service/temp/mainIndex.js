'use strict';

const packageJson = require('./package.json');
process.env.APP_VERSION = packageJson.version;
process.env.APP_PORT = (typeof process.env.APP_PORT === 'undefined') ? 3000 : process.env.APP_PORT;
process.env.NODE_ENV = (typeof process.env.NODE_ENV === 'undefined') ? 'dev' : process.env.NODE_ENV;

require('dotenv').config();
require('app-module-path').addPath(__dirname + '/src');

const sirexjs = require('sirexjs');
// const router = require('core/router');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const routes = require('router/index');
const cors = require('cors');

// TODO Refactor mongoDB connection
// const mongodb = require('core/databases/mongodb');

const app = express();

// Inject extentions
Object.assign(app, sirexjs.extensions());

// router.setRouter(express.Router());
sirexjs.database.mongodb.connect();

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
