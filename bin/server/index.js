'use strict';

module.exports.load = (hooks = {}) => {
  if (typeof hooks.beforeLoad !== 'undefined' && typeof hooks.beforeLoad === 'function') {
    this.beforeLoad = hooks.beforeLoad();
  }

  const packageJson = require(`${process.cwd()}/package.json`);
  process.env.APP_VERSION = packageJson.version;
  process.env.APP_PORT = (typeof process.env.APP_PORT === 'undefined') ? 3000 : process.env.APP_PORT;
  process.env.NODE_ENV = (typeof process.env.NODE_ENV === 'undefined') ? 'dev' : process.env.NODE_ENV;

  require(`${process.cwd()}/node_modules/dotenv`).config();
  require(`${process.cwd()}/node_modules/app-module-path`).addPath(`${process.cwd()}/src`);

  const sirexjs = require(`${process.cwd()}/node_modules/sirexjs`);

  // Load services
  sirexjs.Services.load();
  sirexjs.Middleware.load();

  // const router = require('core/router');
  const express = require(`${process.cwd()}/node_modules/express`);
  const app = express();
  // Object.assign(app, sirexjs.Extensions());

  const fileUpload = require(`${process.cwd()}/node_modules/express-fileupload`);
  const bodyParser = require(`${process.cwd()}/node_modules/body-parser`);
  const routes = require(`${process.cwd()}/src/router/index`);
  const cors = require(`${process.cwd()}/node_modules/cors`);

  // Setup app to use CORS
  app.use(cors());

  //
  app.use(bodyParser.json()); // support json encoded bodies

  app.use(fileUpload()); // Upload files
  
  // Custom response for all reoutes
  app.use(sirexjs.Extensions.restResponse);

  // View requests
  app.use(sirexjs.Extensions.routeRequest);

  let apiVersion = (typeof process.env.API_VERSION !== 'undefined') ? process.env.API_VERSION : '';
  // Load routing
  app.use(`/${apiVersion}`, routes);

  if (typeof hooks.beforeCreate !== 'undefined' && typeof hooks.beforeCreate === 'function') {
    hooks.beforeCreate(app);
  }

  // Spin up application after db connected
  app.listen(process.env.APP_PORT, function() {
    sirexjs.Extensions.logger.info(`${process.env.APP_NAME} v${process.env.APP_VERSION} running on port ${process.env.APP_PORT}`);
    sirexjs.Extensions.logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    if (typeof hooks.created !== 'undefined' && typeof hooks.created === 'function') {
      hooks.created(app);
    }
  });

};
