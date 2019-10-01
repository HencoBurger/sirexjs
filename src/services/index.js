'use strict';

const fs = require('fs');
const path = require('path');

module.exports = class Services {

  get model() {
    const model = require(`${process.cwd()}/src/services/${this.serviceName}/model`);

    return new model();
  }

  manager(managerName, method, properties = {}) {
    try {
      const managerInstance = require(`${process.cwd()}/src/services/${this.serviceName}/managers/${managerName}`);
      if(typeof method !== 'undefined') {
        return managerInstance[method](properties);
      } else {
        return manager;
      }
    } catch(e) {
      logger.error(`[core][services] ${e}`);
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
        servicesFolders[value] = require(`${folderPath}/src/services/${value}`);
      }

      return servicesFolders;
    } catch(e) {
      logger.error(`[sirexjs][services][loadServices]`, e);
      throw e;
    }
  }
}
