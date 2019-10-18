"use strict";

const packageFile = require('./packageFile.js');
const setupData = require('../setupData');

module.exports = () => {
  packageFile(setupData);
  process.exit();
}
