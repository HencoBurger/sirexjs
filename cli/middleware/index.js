"use strict";

const fs = require('fs');
const path = require("path");
const shell = require('shelljs');
const term = require('terminal-kit').terminal;
// const packageFile = require('./packageFile.js');
const middlewareData = require('../middlewareData');
const helpers = require('../helpers');

module.exports = () => {

  let projectFolder = process.cwd();

  let middlewareFolder = `${projectFolder}/src/middleware/${middlewareData.middleware_name}`;

  if(!fs.existsSync(middlewareFolder)) {
    fs.mkdirSync(middlewareFolder);
  } else {
    term.red(`\n\n"${middlewareData.middleware_name}" Folder already exists!\n\n`);
    process.exit();
    return false;
  }

  fs.writeFileSync(`${middlewareFolder}/index.js`,
`'use strict';

// ${middlewareData.middleware_name} Middleware
module.exports = function(req, res, done) {

  done();
}

`);

  process.exit();
}
