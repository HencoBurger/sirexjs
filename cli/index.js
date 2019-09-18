#! /usr/bin/env node
"use strict";

const term = require('terminal-kit').terminal;
const initProject = require('./initProject');

module.exports = (() => {
  let setupOptions = {};

  term(`
    \n\n\n\n
 ######  #### ########  ######## ##     ##       ##  ######
##    ##  ##  ##     ## ##        ##   ##        ## ##    ##
##        ##  ##     ## ##         ## ##         ## ##
 ######   ##  ########  ######      ###          ##  ######
      ##  ##  ##   ##   ##         ## ##   ##    ##       ##
##    ##  ##  ##    ##  ##        ##   ##  ##    ## ##    ##
 ######  #### ##     ## ######## ##     ##  ######   ######
`) ;

term.cyan(`\n
  Service layer architecture for Express.js
  Follow the prompts to setup your new project.
  \n
`) ;

var items = [
  `init     Create new project.`,
  `service  Create new service.`
];

term.singleColumnMenu( items , async function( error , response ) {
  switch(response.selectedIndex) {
    case 0:
      await initProject();
      break;
    case 1:
      // code block
      break;
  }
  // process.exit() ;
} );

  // process.exit();
  // let  project = await initProject();
  // setupOptions = Object.assign(setupOptions, project);
  // term.inputField(
  // 	{autoCompleteMenu: false } ,
  // 	( error , input ) => {
  //
  // 		term.green( "\nYour name is '%s'\n" , input ) ;
  // console.log(setupOptions);
  		// process.exit();
  // 	}
  // );
})();
