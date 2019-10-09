'use strict';
require(`${process.cwd()}/node_modules/app-module-path`).addPath(`${process.cwd()}/node_modules`);
// console.log(`${process.cwd()}/node_modules/sirexjs`);
const sirexjs = require(`sirexjs`);
sirexjs.Extensions();
const serviceGateway = sirexjs.Services.load();


let run = async (payload) => {
  if(typeof payload.exeProcess !== 'undefined') {
    let dotServiceSplit = payload.exeProcess.split('.');
    let method = null;
    for(let key in dotServiceSplit) {
      let dot = dotServiceSplit[key];
      if(method === null) {
        method = serviceGateway[dot];
      } else {
        method = method[dot]
      }
    }
    console.log(method(payload.arg));
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
