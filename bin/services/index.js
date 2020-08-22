'use strict';

const fs = require('fs');
const threads = require('../extensions/threads');
const logger = require('../extensions/logger');

module.exports = class Services {

  get model() {
    try {
      const model = require(`${process.cwd()}/src/services/${this.serviceName}/model`);
      return new model();
    } catch(e) {
      logger.error(`[core][services][model] ${e}`);
      throw e;
    }
  }

  manager(managerName) {
    try {
      return require(`${process.cwd()}/src/services/${this.serviceName}/managers/${managerName}`);
    } catch(e) {
      logger.error(`[core][services][manager]`, e);
      throw e;
    }
  }

  thread(threadName, arg) {
    try {
      return threads(`/services/${this.serviceName}/threads/${threadName}`, arg);
    } catch(e) {
      logger.error(`[core][services][thread]`, e);
      throw e;
    }
  }

  get routes() {
    try {
      const routes = require(`${process.cwd()}/src/services/${this.serviceName}/routes`);

      return routes;
    } catch(e) {
      logger.error(`[sirexjs][services][routes]`, e);
      throw e;
    }
  }

  /**
   * Load all services created by SirexJS-CLI
   */
  static load() {
    try {
      // Get current folder path
      const folderPath = process.cwd();

      // Get all services in the src/services folder, this folder structure was created by the CLI
      let folders = fs.readdirSync(`${folderPath}/src/services`);
      let foundServices = [];

      // Get all services folders and push their names into list of services
      for(let folder of folders) {
        if(fs.lstatSync(`${folderPath}/src/services/${folder}`).isDirectory()) {
          foundServices.push(folder);
        }
      }

      // Initialize services
      for(let key in foundServices) {
        let value = foundServices[key];

        const serviceClass = {
          [value]: class extends Services {
            get serviceName() {
              return value;
            }
          }
        } [value];

        this[value] = new serviceClass();
        logger.info(`Services loaded.`);
      }
    } catch(e) {
      logger.error(`[sirexjs][services][loadServices]`, e);
      throw e;
    }
  }
};
