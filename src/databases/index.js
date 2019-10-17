"use strict";

process.db_status = {
  mongodb: null,
  mysql: false
}

module.exports = {
  mongodb: require('./mongodb')
}
