'use strict';

class RestResponse {

  static response(payload, customStatus) {
      // Default satus
      // Service Unavailable
      // The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.[
      let status = 503;
      let response = {
        'message': 'We seem to have a problem. Please contact support.'
      };

      if(typeof payload.error !== 'undefined') {
        status = payload.status
        response = {
          message: payload.message,
          errors: payload.errors
        };
      } else if(
        typeof payload !== 'undefined' &&
        payload instanceof Object &&
        Object.keys(payload).length > 0
      ) {
        status = (typeof customStatus !== 'undefined') ? customStatus : 200;
        response = payload;
      }

      this.status(status).json(response);
  }

  static setResponse(req, res, next) {
    res.restResponse = RestResponse.response;
    next();
  }
}

module.exports = RestResponse.setResponse;
