'use strict';

const sirexjs = require('sirexjs');

sirexjs.Server.load({
  beforeLoad: () => {
    // Before anything is loaded, even environment variables
    console.log('beforeLoad');
  },
  beforeCreate: (app) => {
    // Callback has access to nodejs instance via "app"
    logger.info('beforeCreate');
  },
  created: (app) => {
    // Callback has access to nodejs instance via "app"
    logger.info('created');
  }
});
