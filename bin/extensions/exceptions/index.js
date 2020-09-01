'use strict';

module.exports.system = (message) => {
  let error = Error(message);
  error.name = 'system';
  return error;
};

module.exports.response = (status = 500,  message = '', errors = []) => {

  let error = new Error(message);

  error.data = {
    'error': true,
    'status': status,
    'message': message,
    'errors': errors
  };

  error.name = 'response';

  return error;
};
