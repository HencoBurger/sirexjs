"use strict";

const fs = require('fs');
const packageFile = require('./packageFile.js');
const setupData = require('../setupData');

module.exports = () => {
  console.log(packageFile(setupData));
  process.exit();
}
