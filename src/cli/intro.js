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
`) ;
}
