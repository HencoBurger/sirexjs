'use strict';

module.exports = class Exceptions {

  set(status = 500,  message = '', errors = []) {
    return {
      'error': true,
      'status': status,
      'message': message,
      'errors': errors
    }
  }
}
