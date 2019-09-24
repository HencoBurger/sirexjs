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
        yes: [
          'y',
          // 'ENTER'
        ],
        no: ['n']
      }, async function(error, result) {

        if (result) {
          setupData.create_project_folder = true;
          await steps.setProjectFolder();
        } else {
          setupData.create_project_folder = false;
          await steps.version();
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
          steps.version();
        }
      );
    },
    version() {
      term(`\nVersion(0.1.0): `);
      term.inputField({
          autoCompleteMenu: false
        },
        async (error, input) => {
          if(input != '') {
            setupData.version = input;
          }
          steps.description();
        }
      );
    },
    description() {
      term(`\nDescription: `);
      term.inputField({
          autoCompleteMenu: false
        },
        async (error, input) => {

          setupData.description = input;
          steps.author();
        }
      );
    },
    author() {
      term(`\nAuthor: `);
      term.inputField({
          autoCompleteMenu: false
        },
        async (error, input) => {

          setupData.author = input;

          await steps.saveNpmPackageFile();
        }
      );

    },
    async saveNpmPackageFile() {
      term.yellow(`\n\nSetting up Sirexjs and Node...`);
      await build();
      return true;
    }
  }

  steps.getName();
};
