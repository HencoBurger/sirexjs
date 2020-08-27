'use strict';

const fs = require('fs');
const logger = require('../extensions/logger');

module.exports = class Middleware {

  static load() {
    try {
      // Get all middleware
      const folderPath = process.cwd();

      let folders = fs.readdirSync(`${folderPath}/src/middleware`);
      
      let foundMiddleware = [];

      for (let folder of folders) {
        if (fs.lstatSync(`${folderPath}/src/middleware/${folder}`).isDirectory()) {
          foundMiddleware.push(folder);
        }
      }
      
      // return foundMiddleware;
      for(let key in foundMiddleware) {
        let value = foundMiddleware[key];
        this[value] = require(`${folderPath}/src/middleware/${value}`);
      }
      logger.info('Middleware loaded.');
    } catch(e) {
      logger.error(`[sirexjs][middleware][loadMiddleware]`, e);
      throw e;
    }
  }
};
