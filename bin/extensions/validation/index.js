'use strict';

const validator = require('validator');
const moment = require('moment');

class Validate {

  constructor(fields) {
    this._validFields = fields;
    this._validData = {};
    this._errors = {};
  }

  get errors() {
    return this._errors;
  }

  get fields() {
    return this._validData;
  }

  setValidFields(fields) {
    this._validFields = fields;
  }

  setError(key, message) {
    this._errors[key] = message;
  }

  isValid(inputs) {
    var fields = this._validFields;
    var isValid = true;
    for (var key in fields) {
      var field = fields[key];
      // Check validation on nested json objects
      if (typeof field.props !== 'undefined') {
        let propInputs = (typeof inputs[key] !== 'undefined') ? inputs[key] : {};
        let valodation = new Validate();
        valodation.setValidFields(field.props);
        if (valodation.isValid(propInputs)) {
          this._validData[key] = valodation.fields;
        } else {
          this._errors[key] = valodation.errors;
        }
      } else {
        var result = this.checkRules(field, key, inputs);

        if (result.error) {
          this._errors[key] = result.message;
        } else {
          if (typeof inputs[key] !== 'undefined') {
            if (typeof field.key !== 'undefined') {
              this._validData[field.key] = inputs[key];
            } else {
              this._validData[key] = inputs[key];
            }
          }
        }
      }
    }


    if (Object.keys(this._errors).length != 0) {
      isValid = false;
    }
    // if(_.size(this._errors) != 0) {
    //   isValid = false;
    // }

    return isValid;
  }

  checkRules(field, key, inputs) {

    var hasError = false;
    var errorMessage = key;

    // First letter of word Uppercase
    errorMessage = `${errorMessage.charAt(0).toUpperCase()}${errorMessage.slice(1)}`;
    if (typeof field.field_name !== 'undefined') {
      errorMessage = field.field_name;
    }

    var validationChecks = {
      'required': 'isRequired',
      'string': 'isString',
      'integer': 'isInteger',
      'float': 'isFloat',
      'boolean': 'isBoolean',
      'date': 'isDate',
      'email': 'isEmail'
    };


    for (let valKey in validationChecks) {
      var method = validationChecks[valKey];
      if (typeof field.rules !== 'undefined' && field.rules.indexOf(valKey) !== -1) {
        let result = this[method](key, inputs);
        if (result.error) {
          hasError = true;
          errorMessage = `${errorMessage}${result.message}`;
        }
      }
    }

    if (hasError) {
      return {
        'error': true,
        'message': errorMessage
      };
    } else {
      return {
        'error': false
      };
    }
  }

  isRequired(key, inputs) {
    var error = false;
    var message = '';
    if (typeof inputs[key] === 'undefined' || inputs[key] === '') {
      error = true;
      message = ' is required';
    }

    return {
      'error': error,
      'message': message
    };
  }

  isInteger(key, inputs) {
    var error = false;
    var message = '';

    if (typeof inputs[key] !== 'undefined' && inputs[key] !== '' && !validator.isInt(String(inputs[key]))) {
      error = true;
      message = ' is not a integer';
    }

    return {
      'error': error,
      'message': message
    };
  }

  isFloat(key, inputs) {
    var error = false;
    var message = '';
    if (typeof inputs[key] !== 'undefined' && inputs[key] !== '' && !validator.isFloat(String(inputs[key]))) {
      error = true;
      message = ' is not a float';
    }

    return {
      'error': error,
      'message': message
    };
  }

  isBoolean(key, inputs) {
    var error = false;
    var message = '';

    if (typeof inputs[key] !== 'undefined' && inputs[key] !== '' && !validator.isBoolean(String(validator.toBoolean(String(inputs[key]))))) {
      error = true;
      message = ' is not boolean';
    }

    return {
      'error': error,
      'message': message
    };
  }

  isDate(key, inputs) {
    var error = false;
    var message = '';

    if (typeof inputs[key] !== 'undefined' && inputs[key] !== '') {
      var data = moment(inputs[key], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      var isValid = moment(data).isValid();

      if (data !== inputs[key]) {
        error = true;
        message = ' is not a valid date';
      } else {
        if (!isValid) {
          error = true;
          message = ' is not a valid date';
        }
      }
    }

    return {
      'error': error,
      'message': message
    };
  }

  isEmail(key, inputs) {
    var error = false;
    var message = '';

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (typeof inputs[key] !== 'undefined' && inputs[key] !== '' && !re.test(String(inputs[key]).toLowerCase())) {
      error = true;
      message = ' is not a valid email format';
    }

    return {
      'error': error,
      'message': message
    };
  }

}

module.exports = () => {
  return new Validate();
};
