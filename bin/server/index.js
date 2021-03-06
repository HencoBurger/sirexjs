'use strict';

module.exports.load = async (hooks = {}) => {
  const sirexjsPackage = require(`../../package.json`);
  console.log(`
 ######  #### ########  ######## ##     ##       ##  ######
##    ##  ##  ##     ## ##        ##   ##        ## ##    ##
##        ##  ##     ## ##         ## ##         ## ##
 ######   ##  ########  ######      ###          ##  ######
      ##  ##  ##   ##   ##         ## ##   ##    ##       ##
##    ##  ##  ##    ##  ##        ##   ##  ##    ## ##    ##
 ######  #### ##     ## ######## ##     ##  ######   ######
v${sirexjsPackage.version}
`);
  if (typeof hooks.beforeLoad !== 'undefined' && typeof hooks.beforeLoad === 'function') {
    await hooks.beforeLoad();
  }

  const packageJson = require(`${process.cwd()}/package.json`);
  require(`${process.cwd()}/node_modules/dotenv`).config();
  require(`${process.cwd()}/node_modules/app-module-path`).addPath(`${process.cwd()}/src`);
  
  process.env.APP_VERSION = packageJson.version;
  process.env.APP_PORT = (typeof process.env.APP_PORT === 'undefined') ? 3000 : process.env.APP_PORT;
  process.env.NODE_ENV = (typeof process.env.NODE_ENV === 'undefined') ? 'dev' : process.env.NODE_ENV;

  const {
    Databases,
    Middleware,
    Services,
    Extensions
  } = require(`${process.cwd()}/node_modules/sirexjs`);

  Databases.load();
  Middleware.load();
  Services.load();

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
  app.use(Extensions.restResponse);

  // View requests
  app.use(Extensions.routeRequest);

  let apiVersion = (typeof process.env.API_VERSION !== 'undefined') ? process.env.API_VERSION : '';
  // Load routing
  app.use(`/${apiVersion}`, routes);

  if (typeof hooks.beforeCreate !== 'undefined' && typeof hooks.beforeCreate === 'function') {
    await hooks.beforeCreate(app);
  }

  // Spin up application after db connected
  app.listen(process.env.APP_PORT, async () => {
    Extensions.logger.info(`${process.env.APP_NAME} v${process.env.APP_VERSION} running on port ${process.env.APP_PORT}`);
    Extensions.logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    if (typeof hooks.created !== 'undefined' && typeof hooks.created === 'function') {
      await hooks.created(app);
    }
  });
};
