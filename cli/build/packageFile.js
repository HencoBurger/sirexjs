"use strict";

const fs = require('fs');
const shell = require('shelljs');

module.exports = async (options) => {
  let defaultInitFile =
`{
  "name": "${options.project_name}",
  "version": "${options.version}",
  "description": "${options.description}",
  "main": "index.js",
  "scripts": {
    "test": "mocha",
    "dev": "nodemon index.js --watch app/ --ignore node_modules/"
  },
  "author": "${options.author}",
  "license": "ISC",
  "dependencies": {
    "app-module-path": "2.2.0",
    "body-parser": "1.19.0",
    "cors": "2.8.5",
    "dotenv": "8.0.0",
    "express": "4.17.1",
    "express-fileupload": "1.1.5",
    "moment": "2.24.0",
    "mongoose": "5.6.12",
    "winston": "3.2.1"
  },
  "devDependencies": {
    "chai": "4.2.0",
    "mocha": "6.2.0",
    "nodemon": "1.19.1"
  }
}`;

  fs.writeFileSync(`${process.cwd()}/package.json`, defaultInitFile);
  fs.mkdirSync(`${process.cwd()}/src`);
  fs.writeFileSync(`${process.cwd()}/src/README.md`, '');
  fs.mkdirSync(`${process.cwd()}/src/middleware`);
  fs.writeFileSync(`${process.cwd()}/src/middleware/README.md`, '');
  fs.mkdirSync(`${process.cwd()}/src/router`);
  fs.writeFileSync(`${process.cwd()}/src/router/README.md`, '');
  fs.mkdirSync(`${process.cwd()}/src/services`);
  fs.writeFileSync(`${process.cwd()}/src/services/README.md`, '');
  fs.mkdirSync(`${process.cwd()}/src/extensions`);
  fs.writeFileSync(`${process.cwd()}/src/extensions/README.md`, '');
  fs.mkdirSync(`${process.cwd()}/src/utilities`);
  fs.writeFileSync(`${process.cwd()}/src/utilities/README.md`, '');
  fs.mkdirSync(`${process.cwd()}/test`);
  fs.writeFileSync(`${process.cwd()}/test/README.md`, '');
  shell.exec('npm i').code;

  return true;
}
