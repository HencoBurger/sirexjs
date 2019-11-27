/* eslint-disable no-useless-catch */
"use strict";

const fs = require('fs');

let loaded = (function () {
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
  let databasesFolders = {};
  for (let key in foundDatabases) {
    let value = foundDatabases[key];
    databasesFolders[value] = require(`${folderPath}/src/databases/${value}`);

  }
  return databasesFolders;
})();

module.exports = class Databases {

  constructor() {
    for (let key in loaded) {
      let toLoad = loaded[key]
      this[key] = new toLoad();
    }
  }

  static connect() {
    (async () => {
      try {
        if (Object.keys(loaded).length !== 0) {
          for (let key in loaded) {
            if (typeof loaded[key] !== 'undefined' &&
              typeof loaded[key].connect !== 'undefined') {
              let connect = await loaded[key].connect();
            }
          }
          process.db_status = true;
        }
      } catch (e) {
        process.db_status = false;
        throw e;
      }
    })();
  }

  static load() {
    return loaded;
  }
};