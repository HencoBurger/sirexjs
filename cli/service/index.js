"use strict";

const fs = require('fs');
const path = require("path");
const term = require('terminal-kit').terminal;
// const packageFile = require('./packageFile.js');
const serviceData = require('../serviceData');
const helpers = require('../helpers');

module.exports = () => {

  let projectFolder = process.cwd();

  let serviceFolder = `${projectFolder}/src/services/${serviceData.service_name}`;

  if(!fs.existsSync(serviceFolder)) {
    fs.mkdirSync(serviceFolder);
  } else {
    term.red(`\n\n"${serviceData.service_name}" Folder already exists!\n\n`);
    process.exit();
    return false;
  }

  fs.writeFileSync(`${serviceFolder}/index.js`,
    `'use strict';

const sirexjs = require('sirexjs');

class ${helpers.capitalized(serviceData.service_name)}Service extends sirexjs.Services {
  get serviceName() {
    return '${serviceData.service_name}';
  }
}

module.exports = (() => { return new ${helpers.capitalized(serviceData.service_name)}Service() })();

`);

  fs.mkdirSync(`${serviceFolder}/routes`);
  let routeIndex = fs.readFileSync(path.resolve(__dirname, "./temp/routeIndex.js"));
  fs.writeFileSync(`${serviceFolder}/routes/index.js`, routeIndex);

  fs.mkdirSync(`${serviceFolder}/model`);
 
  fs.writeFileSync(`${serviceFolder}/model/index.js`,
    `'use strict';

const sirexjs = require('sirexjs');

// You can extend any database class or setup you want

module.exports = class ${helpers.capitalized(serviceData.service_name)}Model {

  get collectionName() {
    return '${serviceData.service_name}';
  }
}
`);
 
  fs.mkdirSync(`${serviceFolder}/managers`);
  fs.writeFileSync(`${serviceFolder}/managers/README.md`,'# Business logic goes here.');

  process.exit();
};
