"use strict";

var term = require( 'terminal-kit' ).terminal;

module.exports = () => {
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
	'a. Go south' ,
	'b. Go west' ,
	'c. Go back to the street'
] ;

term.singleColumnMenu( items , function( error , response ) {
	term( '\n' ).eraseLineAfter.green(
		"#%s selected: %s (%s,%s)\n" ,
		response.selectedIndex ,
		response.selectedText ,
		response.x ,
		response.y
	) ;
	process.exit() ;
} ) ;

}
