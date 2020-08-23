'use strict';

require(`${process.cwd()}/node_modules/app-module-path`)
  .addPath(`${process.cwd()}/node_modules`);

let run = async (payload) => {
  if (typeof payload.exeProcess !== 'undefined') {
    let method = require(`${process.cwd()}/src${payload.exeProcess}`);
    process.send(method(...payload.arg));
  }
};

process.on('message', (payload) => {
      let dbConnect = setInterval(() => {
          // Spin up application after db connected
          run(payload);
          clearInterval(dbConnect);
        }
      });