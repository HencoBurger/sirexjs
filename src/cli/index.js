"use strict";

const term = require('terminal-kit').terminal;
const intro = require('./intro');
const projectName = require('./projectName');

module.exports = async () => {
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
term(`
  \n\n
  Service layer architecture for Express.js
  Follow the prompts to setup your new project.
  \n\n
`);

term.cyan(`
  \n\n
  Service layer architecture for Express.js
  Follow the prompts to setup your new project.
  \n\n
`) ;

var items = [
  'Initiate new project.',
  'Create service.'
];

term.singleColumnMenu( items , function( error , response ) {
  term( '\n' ).eraseLineAfter.green(
    "#%s selected: %s (%s,%s)\n" ,
    response.selectedIndex ,
    response.selectedText ,
    response.x ,
    response.y
  ) ;

  switch(response.selectedIndex) {
    case 0:
      (async () => { await projectName(); })()
      break;
    case 1:
      // code block
      break;
  }
  process.exit() ;
} );

  // process.exit();
  // let  project = await projectName();
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
}
