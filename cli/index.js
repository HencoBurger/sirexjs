#! /usr/bin/env node

"use strict";

const term = require('terminal-kit').terminal;
const initProject = require('./initProject');
const createService = require('./createService');
const createMiddleware = require('./createMiddleware');
const createThread = require('./createThread');

module.exports = (() => {

  term(`
    \n\n\n\n
 ######  #### ########  ######## ##     ##       ##  ######
##    ##  ##  ##     ## ##        ##   ##        ## ##    ##
##        ##  ##     ## ##         ## ##         ## ##
 ######   ##  ########  ######      ###          ##  ######
      ##  ##  ##   ##   ##         ## ##   ##    ##       ##
##    ##  ##  ##    ##  ##        ##   ##  ##    ## ##    ##
 ######  #### ##     ## ######## ##     ##  ######   ######
`);

  term.cyan(`\n
  Service layer architecture for Express.js
  Follow the prompts to setup your new project.
  \n
`);

  var items = [
    `init         Create new project.`,
    `service      Create new service.`,
    `middleware   Create new middleware.`,
    `thread       Create new Child Process.`
  ];

  term.singleColumnMenu(items, async function(error, response) {
    switch (response.selectedIndex) {
    case 0:
      initProject();
      break;
    case 1:
      createService();
      break;
    case 2:
      createMiddleware();
      break;
    case 3:
      createThread();
      break;
    }
    // process.exit() ;
  });
})();
