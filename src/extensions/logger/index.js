'use strict';

const winston = require('winston')

class Logging {

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

  static run() {
    return new Logging();
  }

}

module.exports = Logging.run();
