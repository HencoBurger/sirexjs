"use strict";

const middlewareData = require('./middlewareData');
const middleware = require('./middleware');
const term = require('terminal-kit').terminal;

module.exports = async () => {
  let steps = {
    getName() {
      term(`\n\n\nMiddleware name: `);

      term.inputField({
          autoCompleteMenu: false
        },
        async (error, input) => {

          middlewareData.middleware_name = input;

          await middleware();
        }
      );
    }
  }

  steps.getName();
};
