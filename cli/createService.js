"use strict";

const serviceData = require('./serviceData');
const service = require('./service');
const term = require('terminal-kit').terminal;

module.exports = async () => {
  let steps = {
    getName() {
      term(`\n\n\nService name: `);

      term.inputField({
          autoCompleteMenu: false
        },
        async (error, input) => {

          serviceData.service_name = input;

          await service();
        }
      );
    }
  }

  steps.getName();
};
