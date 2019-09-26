'use strict';

const path = require('path');

module.exports = class Services {

  get model() {
    const model = require(`services/${this.serviceName}/model`);

    return new model();
  }

  manager(managerName, method, properties = {}) {
    try {
      const managerInstance = require(`services/${this.serviceName}/managers/${managerName}`);
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
}
