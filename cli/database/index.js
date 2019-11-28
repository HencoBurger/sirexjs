"use strict";

const fs = require('fs');
const path = require("path");
const term = require('terminal-kit').terminal;
// const packageFile = require('./packageFile.js');
const databaseData = require('../databaseData');
const helpers = require('../helpers');

module.exports = () => {

  let projectFolder = process.cwd();

  let databasesFolder = `${projectFolder}/src/databases`;

  if (!fs.existsSync(databasesFolder)) {
    fs.mkdirSync(databasesFolder);

    fs.writeFileSync(`${projectFolder}/src/databases/index.js`,
      `/*

  DO NOT DELETE OR MODIFY THIS FILE

  This file loads up saved Database connections.

*/

'use strict';

const sirexjs = require('sirexjs');

module.exports = (() => {
 return sirexjs.Database.load();
})();
`);
    fs.writeFileSync(`${projectFolder}/src/databases/README.md`, '');

  }

  let databaseFolder = `${projectFolder}/src/databases/${databaseData.database_name}`;

  if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder);
  } else {
    term.red(`\n\n"${databaseData.database_name}" Folder already exists!\n\n`);
    process.exit();
    return false;
  }

  fs.writeFileSync(`${databaseFolder}/index.js`,
    `'use strict';

const sirexjs = require('sirexjs');

// Database connection goes here

class ${helpers.capitalized(databaseData.database_name)}Database {
  
  /**
   * This function will be called before node spins up.
   * Node will start when there is a successful connection with your database.
   *  
   * @static
   * @returns Promise
   */
  static connect() {
    return new Promise(function (resolve, reject) {
      // Database connection code goes here.
      // Make sure that a successful connection fires "resolve(true)" and a unsuccessful connection a "reject(true)"
    });
  }
}

module.exports = (() => { return new ${helpers.capitalized(databaseData.database_name)}Database(); })();

`);

  process.exit();
};