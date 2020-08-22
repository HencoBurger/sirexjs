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

  static load() {
    try {
      // Get all services
      const folderPath = process.cwd();

      let folders = fs.readdirSync(`${folderPath}/src/services`);
      let foundServices = [];

      for(let folder of folders) {
        if(fs.lstatSync(`${folderPath}/src/services/${folder}`).isDirectory()) {
          foundServices.push(folder);
        }
      }

      // return foundServices;
      let servicesFolders = {};
      for(let key in foundServices) {
        let value = foundServices[key];

        const myClass = {
          [value]: class extends Services {
            get serviceName() {
              return value;
            }
          }
        } [value];

        servicesFolders[value] = new myClass();
      }

      return servicesFolders;
    } catch(e) {
      logger.error(`[sirexjs][services][loadServices]`, e);
      throw e;
    }
  }
};
