'use strict';

require(`${process.cwd()}/node_modules/app-module-path`)
  .addPath(`${process.cwd()}/node_modules`);

const {
  Databases,
  Middleware,
  Services
} = require(`${process.cwd()}/node_modules/sirexjs`);

Databases.load();
Middleware.load();
Services.load();

let run = async (payload) => {
  if (typeof payload.exeProcess !== 'undefined') {
    let method = require(`${process.cwd()}/src${payload.exeProcess}`);
    process.send(method(payload.arg));
  }
};

process.on('message', (payload) => {
  run(payload);
});