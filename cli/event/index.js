"use strict";

const fs = require('fs');
const term = require('terminal-kit').terminal;
// const packageFile = require('./packageFile.js');
const eventData = require('../eventData');

module.exports = () => {

  // Remove whitespace
  eventData.event_name = eventData.event_name.replace(/\s/g, '');

  let projectFolder = process.cwd();

  let eventFolder = `${projectFolder}/src/wsEvents`;

  if(!fs.existsSync(eventFolder)) {
    fs.mkdirSync(eventFolder);
  }

  fs.writeFileSync(`/${eventFolder}/${eventData.event_name}.js`,
    `'use strict';

// ${eventData.event_name} WebSocket event function
module.exports = function ${eventData.event_name}() {
  // Put some code here.
  return 'something';
}

`);

  process.exit();
};
