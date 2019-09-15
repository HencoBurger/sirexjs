"use strict";

const term = require('terminal-kit').terminal;
const intro = require('./intro');
const projectName = require('./projectName');

module.exports = async () => {
  let setupOptions = {};

  intro();
  let  project = await projectName();
  setupOptions = Object.assign(setupOptions, project);
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
