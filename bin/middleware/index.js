'use strict';

const fs = require('fs');
const logger = require('../extensions/logger');

module.exports = class Middleware {

  static load() {
    try {
      // Get all middleware
      const folderPath = process.cwd();

      let Files = fs.readdirSync(`${folderPath}/src/middleware`);
      
      let foundServices = [];

      var getJsFiles = new RegExp('\.js+$','i');

      for(let file of Files) {
        if (
          fs.statSync(`${folderPath}/src/middleware/${file}`).isFile() &&
          file.match(getJsFiles)
        ) {
          foundServices.push(file.split(".")[0]);
        }
      }

      // return foundServices;
      for(let key in foundServices) {
        let value = foundServices[key];
        this[value] = require(`${folderPath}/src/middleware/${value}`);
      }
      logger.info('Middleware loaded.');
    } catch(e) {
      logger.error(`[sirexjs][middleware][loadMiddleware]`, e);
      throw e;
    }
  }
};
