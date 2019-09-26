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
        (error, input) => {

          serviceData.service_name = input;

          steps.createFolder();
        }
      );
    },
    async saveNpmPackageFile() {
      term.yellow(`\n\nSetting up Sirexjs and Node...`);
      await service();
      return true;
    }
  }

  steps.getName();
};
