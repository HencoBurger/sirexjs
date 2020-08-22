'use strict';

const moment = require('moment');

class RestResponse {

  static setUrl(url) {
    this._requestUrl = url;
  }

  static setMetod(method) {
    this._requestMethod = method;
  }

  static get requestUrl() {
    return this._requestUrl;
  }

  static get requestMethod() {
    return this._requestMethod;
  }

  static response(payload, customStatus) {
    // Default satus
    // Service Unavailable
    // The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.[
    let status = 503;
    let timestamp = moment.utc();
    let response = {
      message: 'We seem to have a problem. Please contact support and reference the included information.',
      endpoint: RestResponse.requestUrl,
      method: RestResponse.requestMethod,
      timestamp: timestamp,
    };

    // Check to see if this is a system error
    if(payload instanceof Error && payload.name === 'response') {
      status = payload.data.status;
      response.message = payload.data.message;
      response.errors = payload.data.errors;
    // Check to see if this is a response error
    } else if(payload instanceof Error) {
      console.trace(`Timestamp: ${timestamp}`,payload);
      if(payload.name === 'system') {
        response.message = payload.message;
      }
    } else {
      status = (typeof customStatus !== 'undefined') ? customStatus : 200;
      response = payload;
    }
    this.status(status).json(response);
  }

  static setResponse(req, res, next) {
    let restResponse = RestResponse;
    restResponse.setUrl(req.url);
    restResponse.setMetod(req.method);
    res.restResponse = restResponse.response;
    next();
  }
}

module.exports = RestResponse.setResponse;
