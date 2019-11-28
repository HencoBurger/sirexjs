"use strict";

const databaseData = require('./databaseData');
const database = require('./database');
const term = require('terminal-kit').terminal;

module.exports = async () => {
  let steps = {
    getName() {
      term(`\n\n\nDatabase name: `);

      term.inputField({
        autoCompleteMenu: false
      },
      async (error, input) => {

        databaseData.database_name = input;

        await database();
      }
      );
    }
  };

  steps.getName();
};
