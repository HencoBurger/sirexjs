'use strict';

require(`${process.cwd()}/node_modules/app-module-path`)
  .addPath(`${process.cwd()}/node_modules`);

let run = async (payload) => {
  if (typeof payload.exeProcess !== 'undefined') {
    let method = require(`${process.cwd()}/src${payload.exeProcess}`);
    console.log('...payload.arg', payload.argthod);
    // process.send(method(...payload.arg));
  }
};

process.on('message', (payload) => {
  run(payload);
});