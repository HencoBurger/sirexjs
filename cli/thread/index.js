"use strict";

const fs = require('fs');
const term = require('terminal-kit').terminal;
// const packageFile = require('./packageFile.js');
const threadData = require('../threadData');

module.exports = () => {

  let projectFolder = process.cwd();

  let threadFolder = `${projectFolder}/src/services/${threadData.service_name}`;

  if(!fs.existsSync(threadFolder)) {
    term.red(`\n\n"${threadData.service_name}" Service does not exists!\n\n`);
    process.exit();
    return false;
  }

  threadFolder = `${threadFolder}/threads`;

  if(!fs.existsSync(threadFolder)) {
    fs.mkdirSync(threadFolder);
  }

  threadFolder = `${threadFolder}/${threadData.thread_name}`;

  if(!fs.existsSync(threadFolder)) {
    fs.mkdirSync(threadFolder);
  } else {
    term.red(`\n\n"${threadData.thread_name}" Folder already exists!\n\n`);
    process.exit();
    return false;
  }

  fs.writeFileSync(`${threadFolder}/index.js`,
`'use strict';

// ${threadData.thread_name} Thread function
module.exports = function() {
  // Put some long running code here.
  return 'something';
}

`);

  process.exit();
}
