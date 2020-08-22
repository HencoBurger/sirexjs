'use strict';

const Databases = require('../../databases');

require(`${process.cwd()}/node_modules/app-module-path`)
  .addPath(`${process.cwd()}/node_modules`);

const sirexjs = require(`${process.cwd()}/node_modules/sirexjs`);
sirexjs.Services.load();

let run = async (payload) => {
  if(typeof payload.exeProcess !== 'undefined') {
    let method = require(`${process.cwd()}/src${payload.exeProcess}`);
    process.send(method(...payload.arg));
  }
};

Databases.connect();

process.on('message', (payload) => {
  let dbConnect = setInterval(() => {
    if (process.db_status) {
      // Spin up application after db connected
      run(payload);
      clearInterval(dbConnect);
    }
  },1);
});
