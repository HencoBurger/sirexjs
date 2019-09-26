'use strict';

const winston = require('winston')

module.exports = class Logging {

  constructor() {
    return winston.createLogger({
      transports: [
        new winston.transports.Console(),
        // new winston.transports.File({
        //   filename: 'combined.log'
        // })
      ]
    });
  }

}
