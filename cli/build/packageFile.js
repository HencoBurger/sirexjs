"use strict";

const fs = require('fs');
const shell = require('shelljs');
const term = require('terminal-kit').terminal;

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

  fs.writeFileSync(`${projectFolder}/package.json`, defaultInitFile);
  fs.mkdirSync(`${projectFolder}/src`);
  fs.writeFileSync(`${projectFolder}/src/README.md`, '');
  fs.mkdirSync(`${projectFolder}/src/middleware`);
  fs.writeFileSync(`${projectFolder}/src/middleware/README.md`, '');
  fs.mkdirSync(`${projectFolder}/src/router`);
  fs.writeFileSync(`${projectFolder}/src/router/README.md`, '');
  fs.mkdirSync(`${projectFolder}/src/services`);
  fs.writeFileSync(`${projectFolder}/src/services/README.md`, '');
  fs.mkdirSync(`${projectFolder}/src/extensions`);
  fs.writeFileSync(`${projectFolder}/src/extensions/README.md`, '');
  fs.mkdirSync(`${projectFolder}/src/utilities`);
  fs.writeFileSync(`${projectFolder}/src/utilities/README.md`, '');
  fs.mkdirSync(`${projectFolder}/test`);
  fs.writeFileSync(`${projectFolder}/test/README.md`, '');

  // var child = shell.exec('npm i', {async:true});
  // child.stdout.on('data', function(data) {
  //   console.log(data);
  // });
  //
  // child.stdout.on('close', (code) => {
  //   return true;
  // });
  shell.cd(projectFolder);
  shell.exec('npm i');

}
