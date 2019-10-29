"use strict";

const fs = require('fs');
const path = require("path");
const shell = require('shelljs');
const term = require('terminal-kit').terminal;

module.exports = async (options) => {
  try {
    let defaultInitFile =
`{
  "name": "${options.project_name}",
  "version": "${options.version}",
  "description": "${options.description}",
  "main": "index.js",
  "scripts": {
    "lint": "eslint --fix src/",
    "test": "mocha",
    "dev": "nodemon index.js --watch src/ --ignore node_modules/"
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
    "mongoose": "5.7.5",
    "winston": "3.2.1",
    "sirexjs": "${options.sirex_version}"
  },
  "devDependencies": {
    "chai": "4.2.0",
    "eslint": "6.5.1",
    "mocha": "6.2.0",
    "nodemon": "1.19.1"
  }
}`;

    let projectFolder = process.cwd();

    if(options.create_project_folder) {
      projectFolder = options.project_folder_name;
      if(!fs.existsSync(projectFolder)) {
        fs.mkdirSync(`${projectFolder}`);
      } else {
        term.red(`\n\n"${projectFolder}" Folder already exists!\n\n`);
        process.exit();
        return false;
      }
    }

    fs.writeFileSync(`${projectFolder}/README.md`, `# ${options.project_name}
${options.description}
`);

    fs.writeFileSync(`${projectFolder}/.eslintrc.json`, `{
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "semi": ["error", "always"],
        "indent": ["error", 2]
    }
}
`);

    fs.writeFileSync(`${projectFolder}/.env-temp`,
      `# Environment variables go here.
APP_NAME=${options.project_name}
NODE_ENV=dev
APP_PORT=3000

# MongoDB URL
MONGODB=mongodb://localhost:27017/your_db_name_here
`);

    fs.writeFileSync(`${projectFolder}/.gitignore`,
      `/node_modules
.env
`);



    let mainIndex = fs.readFileSync(path.resolve(__dirname, "../service/temp/mainIndex.js"));
    fs.writeFileSync(`${projectFolder}/index.js`, mainIndex);

    fs.writeFileSync(`${projectFolder}/package.json`, defaultInitFile);

    fs.mkdirSync(`${projectFolder}/src`);
    fs.writeFileSync(`${projectFolder}/src/README.md`, '');

    fs.mkdirSync(`${projectFolder}/src/middleware`);
    fs.writeFileSync(`${projectFolder}/src/middleware/index.js`,
      `/*

  DO NOT DELETE OR MODIFY THIS FILE

  This file loads up saved middleware.

*/

'use strict';

const sirexjs = require('sirexjs');

module.exports = (() => {
 return sirexjs.Middleware.load();
})();
`);
    fs.writeFileSync(`${projectFolder}/src/middleware/README.md`, '');

    fs.mkdirSync(`${projectFolder}/src/router`);
    let routeIndex = fs.readFileSync(path.resolve(__dirname, "../service/temp/routeIndex.js"));
    fs.writeFileSync(`${projectFolder}/src/router/index.js`, routeIndex);
    fs.writeFileSync(`${projectFolder}/src/router/README.md`, 'Initial router');

    fs.mkdirSync(`${projectFolder}/src/services`);
    fs.writeFileSync(`${projectFolder}/src/services/README.md`, 'Home of all your created services.');
    let serviceIndex = fs.readFileSync(path.resolve(__dirname, "../service/temp/serviceIndex.js"));
    fs.writeFileSync(`${projectFolder}/src/services/index.js`, serviceIndex);

    fs.mkdirSync(`${projectFolder}/src/utilities`);
    fs.writeFileSync(`${projectFolder}/src/utilities/README.md`, `Place code here that doesn't really belong under a service, things like payment platform SDK or transactional email provider.
      `);

    fs.mkdirSync(`${projectFolder}/test`);
    fs.writeFileSync(`${projectFolder}/test/README.md`, 'Put all the test for your code here.');

    if(process.cwd() !== projectFolder) {
      shell.cd(projectFolder);
    }

    shell.exec('npm i');
    shell.exec('npm shrinkwrap');

    term.green(`\n\nSetup and ready to go...`);
  } catch(e) {
    console.error(e);
  }
};
