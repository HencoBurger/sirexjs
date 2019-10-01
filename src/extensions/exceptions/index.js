'use strict';

module.exports = (status = 500,  message = '', errors = []) => {
  return {
    'error': true,
    'status': status,
    'message': message,
    'errors': errors
  }
}
