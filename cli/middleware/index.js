"use strict";

const fs = require('fs');
const term = require('terminal-kit').terminal;
// const packageFile = require('./packageFile.js');
const middlewareData = require('../middlewareData');

module.exports = () => {

  middlewareData.middleware_name = middlewareData.middleware_name.replace(/\s/g, '');

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
module.exports = function ${middlewareData.middleware_name}(req, res, done) {

  done();
}

`);

  process.exit();
};
