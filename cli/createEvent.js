"use strict";

const eventData = require('./eventData');
const event = require('./event');
const term = require('terminal-kit').terminal;

module.exports = async () => {
  let steps = {
    getEventName() {
      term(`\n\n\nName of websocket event? `);

      term.inputField({
        autoCompleteMenu: false
      },
      async (error, input) => {

        eventData.event_name = input;

        await event();
      });
    }
  };

  steps.getEventName();
};
