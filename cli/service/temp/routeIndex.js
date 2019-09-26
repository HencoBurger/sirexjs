'use strict';

const express = require('express');
const router = express.Router();

// User authentication
const middleware = require('middleware');
const serviceGateway = require('services');

module.exports = (function () {

  router.get('*', (req, res) =>{
    res.status(200).send(`Resource not be found.`);
  });

  return router;
})();
