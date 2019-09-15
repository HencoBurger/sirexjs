"use strict";

var term = require('terminal-kit').terminal;



module.exports = async () => {
  let projectName = {};

  let steps = {
    getName() {
      term(`Project name: `);

      term.inputField({
          autoCompleteMenu: false
        },
        (error, input) => {

          projectName.project_name = input;
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
          projectName.create_project_folder = true;
          steps.setProjectFolder();

        } else {
          return projectName;
        }
      });
    },
    setProjectFolder() {
      term(`\nFolder`);
    }
  }

  steps.getName();
}
