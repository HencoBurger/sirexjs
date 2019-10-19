"use strict";

const packageFile = require('./packageFile.js');
const setupData = require('../setupData');

const packageJson = require(`../../package.json`);
setupData.sirex_version = packageJson.version;

module.exports = () => {
  packageFile(setupData);
  process.exit();
};
