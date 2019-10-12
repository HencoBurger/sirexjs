'use strict';
require(`${process.cwd()}/node_modules/app-module-path`)
.addPath(`${process.cwd()}/node_modules`);

const sirexjs = require(`sirexjs`);
sirexjs.Extensions();
const serviceGateway = sirexjs.Services.load();


let run = async (payload) => {
  if(typeof payload.exeProcess !== 'undefined') {
    let method = require(`${process.cwd()}/src${payload.exeProcess}`);
    process.send(method(payload.arg));
  }
};


process.on('message', (payload) => {
  let dbConnect = setInterval(() => {

    let dbStatus = process.db_status;
    if(dbStatus.mongodb !== null && dbStatus.mysql !== null) {
      // Spin up application after db connected
      run(payload);

      clearInterval(dbConnect);
    }
  },1);


});
