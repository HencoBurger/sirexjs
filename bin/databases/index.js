/* eslint-disable no-useless-catch */
"use strict";

const fs = require('fs');
const logger = require('../extensions/logger');

module.exports = class Databases {

  static load() {
    try {
      // Get all services
      const folderPath = process.cwd();

      let folders = fs.readdirSync(`${folderPath}/src/databases`);
      let foundDatabases = [];

      for (let folder of folders) {
        if (fs.lstatSync(`${folderPath}/src/databases/${folder}`).isDirectory()) {
          foundDatabases.push(folder);
        }
      }

      // return foundDatabases;
      for (let key in foundDatabases) {
        let value = foundDatabases[key];
        this[value] = require(`${folderPath}/src/databases/${value}`);
      }
      logger.info('Databases loaded.');
    } catch (e) {
      logger.error(`[sirexjs][databases][loadDatabase]`, e);
      throw e;
    }
  }
};