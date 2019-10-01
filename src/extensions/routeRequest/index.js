'use strict';

module.exports = function (req, res, next) {
  logger.info(`${req.method}: ${req.headers.host}${req.originalUrl}`);
  next();
}
