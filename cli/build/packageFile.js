"use strict";

module.exports = async (options) => {
  let defaultInitFile = `
    {
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
    }
  `
}
