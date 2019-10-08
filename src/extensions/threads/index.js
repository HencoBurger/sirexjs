'use strict';

const path = require('path');
const childProcess = require('child_process');
const moment = require('moment');

class Threads {

  constructor() {
    try {
      this.thread = null;

      this.thread = childProcess.fork(`${__dirname}/load.js`, [
        // runService
      ], {
        'cwd': process.cwd(),
        'env': process.env
      });


      return this;
    } catch (e) {
      console.error('[MultiThread][constructor]');
      console.error(e);
      throw e;
    }
  }

  send(payload) {
    return new Promise((resolve, reject) => {

      this.thread.send(payload);

      this.thread.on('message', (response) => {
        console.log(response);
        resolve(response);
      });

      this.thread.on('error', (error) => {
        reject(error);
        console.error('Worker errored:', error);
        // this.thread.kill(SIGTERM);
        this.thread.kill();
      });

      this.thread.on('exit', function(exit) {
        console.info(exit);
        reject(exit);
        console.info('Worker has been terminated.');
      });
    });
  }

  received(callback) {
    // return new Promise((resolve, reject) => {
      this.thread.on('message', (response) => {
        console.log(response);
        callback(false, response);
        // resolve(response);
      });

      this.thread.on('error', (error) => {
        callback(error, null);
        // reject(error);
        console.error('Worker errored:', error);
        // this.thread.kill(SIGTERM);
        this.thread.kill();
      });

      this.thread.on('exit', (exit) => {
        console.info(exit);
        callback(exit, null);
        // reject(exit);
        console.info('Worker has been terminated.');
      });
    // });
  }

};

module.exports = {
  _treads: {},
  run(exeProcess = '', arg = []) {

    let currentThread = {};

    if (Object.keys(this._treads).length === 0) {
      currentThread = this.createThread();
    } else {
      for(let key in this._treads) {
        let thread = this._treads[key];
        if(tread.status === 'idle') {
          currentThread = this.assignThread(thread);
        }
      }
    }

    if(
      typeof exeProcess !== 'undefined'
    ) {
      console.log('send thread');
      currentThread.childProcess.send({'exeProcess': exeProcess, 'arg': arg});
    }
    console.log('child process',currentThread.childProcess);
    return currentThread.childProcess;
  },
  createThread() {
    let timestamp = moment().format('x');

    this._treads[timestamp] = {
      'status': 'active',
      'created_at': timestamp,
      'updated_at': timestamp,
      'childProcess': new Threads()
    };

    return this._treads[timestamp];
  },
  assignThread(thread) {
    let timestamp = moment().format('x');

    thread.status = 'active';
    thread.updated_at = timestamp;

    return thread;
  },
  // tread(exeProcess) {
  //
  //   let tread = null;
  //
  //   if (typeof this._treads[exeProcess] !== 'undefined') {
  //     tread = this._treads[exeProcess].childProcess;
  //   }
  //
  //   return tread;
  // },
  list() {
    return (this._treads === null) ? [] : Object.keys(this._treads);
  }
}

setInterval(() => {
  let timestamp = moment().subtract(3, 'seconds').format('x');
  for(let key in this._treads) {
    let thread = this._treads[key];

    if(tread.status === 'idle' && thread.updated_at < timestamp) {
      tread.childProcess.kill();
      console.log('kill process', tread.created_at);
    }
  }
}, 3000);
