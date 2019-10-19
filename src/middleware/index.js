'use strict';

const fs = require('fs');
const logger = require('../extensions/logger');

module.exports = class Middleware {

  static load() {
    try {
      // Get all middleware
      const folderPath = process.cwd();

      let folders = fs.readdirSync(`${folderPath}/src/middleware`);
      let foundServices = [];

      for(let folder of folders) {
        if(fs.lstatSync(`${folderPath}/src/middleware/${folder}`).isDirectory()) {
          foundServices.push(folder);
        }
      }

      // return foundServices;
      let middlewareFolders = {};
      for(let key in foundServices) {
        let value = foundServices[key];
        middlewareFolders[value] = require(`${folderPath}/src/middleware/${value}`);
      }

      return middlewareFolders;
    } catch(e) {
      logger.error(`[sirexjs][middleware][loadMiddleware]`, e);
      throw e;
    }
  }
};
