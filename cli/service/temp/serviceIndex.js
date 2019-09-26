/*

  DO NOT DELETE OR MODIFY THIS FILE

  This file loads up saved services.

 */

'use strict';

/**
 * Get all services
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
const services = (() => { const fs = require('fs');
  const folderPath = process.cwd();

  let folders = fs.readdirSync(`${folderPath}/src/services`);
  let foundServices = [];

  for(let folder of folders) {
    if(fs.lstatSync(`${folderPath}/src/services/${folder}`).isDirectory()) {
      foundServices.push(folder);
    }
  }

  return foundServices;
})();

module.exports = (() => {
  let servicesFolders = {};
  for(let key in services) {
    let value = services[key];
    servicesFolders[value] = require(`services/${value}`);
  }
  return servicesFolders;
})()
