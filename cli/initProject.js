"use strict";

const setupData = require('./setupData');
const build = require('./build');
const term = require('terminal-kit').terminal;

module.exports = async () => {
  let steps = {
    getName() {
      term(`\n\n\nProject name: `);

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
      }, async function(error, result) {

        if (result) {
          setupData.create_project_folder = true;
          await steps.setProjectFolder();
        } else {
          setupData.create_project_folder = false;
          await steps.packageOptions();
        }
      });
    },
    async setProjectFolder() {
      term(`\nChoose folder name: `);
      term.inputField({
          autoCompleteMenu: false
        },
        async (error, input) => {

          setupData.project_folder_name = input;
          await steps.packageOptions();
        }
      );
    },
    async packageOptions() {
      term(`\nVersion: (0.1.0)`);
      term.inputField({
          autoCompleteMenu: false
        },
        (error, input) => {

          setupData.version = input;
        }
      );

      term(`\nDescription: `);
      term.inputField({
          autoCompleteMenu: false
        },
        (error, input) => {

          setupData.description = input;
        }
      );

      term(`\nAuthor: `);
      term.inputField({
          autoCompleteMenu: false
        },
        (error, input) => {

          setupData.author = input;
        }
      );

      await steps.saveNpmPackageFile();
    },
    async saveNpmPackageFile() {
      await build();
    }
  }

  steps.getName();
};
