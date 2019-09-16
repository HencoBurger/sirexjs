"use strict";

var setupData = require('./setupData');
var term = require('terminal-kit').terminal;

module.exports = async () => {
  let steps = {
    getName() {
      term(`Project name: `);

      term.inputField({
          autoCompleteMenu: false
        },
        (error, input) => {

          setupData.project_name = input;

          steps.createFolder();
        }
      );
    },
    createFolder() {
      term(`\nDo you want to create a project folder? [y|n]`);
      term.yesOrNo({
        yes: ['y', 'ENTER'],
        no: ['n']
      }, function(error, result) {

        if (result) {
          setupData.create_project_folder = true;
          steps.setProjectFolder();
        } else {
          setupData.create_project_folder = false;
          console.log(setupData);
          process.exit();
          return true;
        }
      });
    },
    setProjectFolder() {
      term(`\nChoose folder name: `);
      term.inputField({
          autoCompleteMenu: false
        },
        (error, input) => {

          setupData.project_folder_name = input;
          console.log(setupData);
          process.exit();
        }
      );
    }
  }

  steps.getName();
};
