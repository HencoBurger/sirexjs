'use strict';

const path = require('path');
const childProcess = require('child_process');
const moment = require('moment');

class Threads {

  constructor() {
    try {

      let timestamp = moment().format('x');

      this._status = 'active';
      this._created_at = timestamp,
      this._updated_at = timestamp,

      this._thread = childProcess.fork(`${__dirname}/load.js`, [
        // runService
      ], {
        'cwd': process.cwd(),
        'env': process.env
      });


      return this;
    } catch (e) {
      throw e;
    }
  }

  set status(value) {
    this._status =  value;
  }

  get status() {
    return this._status;
  }

  set created_at(value) {
    this._created_at =  value;
  }

  get created_at() {
    return this._created_at;
  }

  set updated_at(value) {
    this._updated_at =  value;
  }

  get updated_at() {
    return this._updated_at;
  }

  kill() {
    return this._thread.kill();
  }

  send(payload) {
    try {
      return new Promise((resolve, reject) => {
        let timestamp = moment().format('x');
        this.updated_at = timestamp;
        this.status = 'active';
        this._thread.send(payload);

        this._thread.on('message', (response) => {
          console.log(response);
          this.status = 'idle';
          resolve(response);
        });

        this._thread.on('error', (error) => {
          this.status = 'idle';
          reject(error);
          console.error('Worker errored:', error);
          // this._thread.kill(SIGTERM);
          this._thread.kill();
        });

        this._thread.on('exit', function(exit) {
          this.status = 'idle';
          console.info(exit);
          reject(exit);
          console.info('Worker has been terminated.');
        });
      });
    } catch(e) {
      throw e;
    }
  }

  received(callback) {
    try {
    // return new Promise((resolve, reject) => {
      this._thread.on('message', (response) => {
        this.status = 'idle';
        console.log(response);
        callback(false, response);
        // resolve(response);
      });

      this._thread.on('error', (error) => {
        this.status = 'idle';
        callback(error, null);
        // reject(error);
        console.error('Worker errored:', error);
        // this._thread.kill(SIGTERM);
        this._thread.kill();
      });

      this._thread.on('exit', (exit) => {
        this.status = 'idle';
        console.info(exit);
        callback(exit, null);
        // reject(exit);
        console.info('Worker has been terminated.');
      });
    } catch(e) {
      throw e;
    }
  }

};

 const threadList = {
  _threads: [],
  run(exeProcess = '', arg = []) {
    try {

      let currentThread = null;

      if (this._threads.length === 0) {
        currentThread = new Threads();
        this._threads.push(currentThread);
        // currentThread = this.createThread();
      } else {
        console.log(this._threads);
        for(let thread of this._threads) {
          if(thread.status === 'idle') {
            currentThread = thread;
          }
        }
      }

      if(currentThread == null) {
        currentThread = new Threads();
        this._threads.push(currentThread);
      }

      if(
        typeof exeProcess !== 'undefined'
      ) {
        currentThread.send({'exeProcess': exeProcess, 'arg': arg});
      }

      return currentThread;
    } catch(e) {
      console.log(e);
      throw e;
    }
  },
  // createThread() {
  //   try {
  //     let timestamp = moment().format('x');
  //
  //     let newThread = {
  //       'status': 'active',
  //       'created_at': timestamp,
  //       'updated_at': timestamp,
  //       'childProcess': new Threads()
  //     };
  //
  //     this._threads.push(newThread);
  //
  //     return newThread;
  //   } catch(e) {
  //     console.log(e);
  //     throw e;
  //   }
  // },
  // assignThread(thread) {
  //   try {
  //     let timestamp = moment().format('x');
  //
  //     thread.status = 'active';
  //     thread.updated_at = timestamp;
  //
  //     return thread;
  //   } catch(e) {
  //     console.log(e);
  //     throw e;
  //   }
  // },
  // list() {
  //   return (this._threads === null) ? [] : Object.keys(this._threads);
  // }
}

setInterval(() => {
  let timestamp = moment().subtract(3, 'seconds').format('x');
  for(let key in threadList._threads) {
    let thread = threadList._threads[key];
    // let thread = this._threads[key];

    if(thread.status === 'idle' && thread.updated_at < timestamp) {
      thread.kill();
      console.log('kill process', thread.created_at);
      threadList._threads.splice(key);
    }
  }
}, 3000);

module.exports = threadList;
