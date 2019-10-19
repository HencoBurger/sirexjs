"use strict";

const threadData = require('./threadData');
const thread = require('./thread');
const term = require('terminal-kit').terminal;

module.exports = async () => {
  let steps = {
    getServiceName() {
      term(`\n\n\nThis thread is for which Service? `);

      term.inputField({
        autoCompleteMenu: false
      },
      async (error, input) => {

        threadData.service_name = input;

        await steps.getThreadName();
      }
      );


    },
    getThreadName() {
      term(`\n\n\nThread name: `);

      term.inputField({
        autoCompleteMenu: false
      },
      async (error, input) => {

        threadData.thread_name = input;

        await thread();
      }
      );
    }
  };

  steps.getServiceName();
};
