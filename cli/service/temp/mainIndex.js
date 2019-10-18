'use strict';

const sirexjs = require('sirexjs');

sirexjs.Server.load({
  beforeLoad: () => {
    // Before anything is loaded, even environment variables
  },
  beforeCreate: (app) => {
    // Callback has access to nodejs instance via "app"
  },
  created: (app) => {
    // Callback has access to nodejs instance via "app"
  }
});
