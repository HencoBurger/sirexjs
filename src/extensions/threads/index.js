'use strict';

const path = require('path');
const childProcess = require('child_process');
const moment = require('moment');

class Thread {

  constructor() {
    try {

      let timestamp = moment().format('x');
      this._threadMessage = null;
      this._threadMessageRx = false;
      this._threadError = null;
      this._threadErrorRx = false;
      this._threadExit = null;
      this._threadExitRx = false;

      this._status = 'active';
      this._created_at = timestamp,
        this._updated_at = timestamp,

        this._thread = childProcess.fork(`${__dirname}/load.js`, [
          // runService
        ], {
          'cwd': process.cwd(),
          'env': process.env
        });

      this._thread.on('message', (response) => {
        this._threadMessageRx = true;
        this.status = 'idle';
        this._threadMessage = response;
      });

      this._thread.on('error', this.onError);

      this._thread.on('exit', this.onExit);

      return this;
    } catch (e) {
      throw e;
    }
  }

  onMessage(response) {
    this._threadMessageRx = true;
    this._threadMessage = response;
    // callback(false, response);
  }

  onError(error) {
    this._threadErrorRx = true;
    this._threadError = error;
    // callback(error, null);
    // this._thread.kill(SIGTERM);
    this._thread.kill();
  }

  onExit(exit) {
    this._threadExitRx = true;
    this._threadExitRx = exit;
    // callback(exit, null);
  }


  get timestamp() {
    return moment().format('x');
  }

  set status(value) {
    this._status = value;
  }

  get status() {
    return this._status;
  }

  set created_at(value) {
    this._created_at = value;
  }

  get created_at() {
    return this._created_at;
  }

  set updated_at(value) {
    this._updated_at = value;
  }

  get updated_at() {
    return this._updated_at;
  }

  kill() {
    return this._thread.kill();
  }

  send(payload) {
    try {
      // return new Promise((resolve, reject) => {
      this.updated_at = this.timestamp;
      this.status = 'active';
      this._thread.send(payload);
    } catch (e) {
      throw e;
    }
  }

  received(callback) {
    try {
      return new Promise((resolve, reject) => {
        setInterval(() => {
          if(this._threadMessageRx) {
            this.status = 'idle';
            this.updated_at = this.timestamp;
            console.log(this.updated_at);
            resolve(this._threadMessage);
            // callback(false, this._threadMessage);
            this._threadMessageRx = false;

          }
          if(this._threadErrorRx) {
            this.status = 'idle';
            this.updated_at = this.timestamp;
            console.log(this.updated_at);
            reject(this._threadError);
            // callback(this._threadError, false);
            this._threadErrorRx = false;
          }
          if(this._threadExitRx) {
            this.status = 'idle';
            this.updated_at = this.timestamp;
            console.log(this.updated_at);
            reject(this._threadExit);
            // callback(this._threadExit, false);
            this._threadExitRx = false;
          }
        },1);
        // this._thread.on('message', (response) => {
        //   this.status = 'idle';
        //   callback(false, response);
        //   resolve(response);
        // });
        //
        // this._thread.on('error', (error) => {
        //   this.status = 'idle';
        //   callback(error, null);
        //   // this._thread.kill(SIGTERM);
        //   this._thread.kill();
        //   reject(exit);
        // });
        //
        // this._thread.on('exit', (exit) => {
        //   this.status = 'idle';
        //   callback(exit, null);
        //   reject(exit);
        // });
      });
    } catch (e) {
      throw e;
    }
  }

};

const threadCollection = {
  _threads: [],
  run(exeProcess = '', arg = []) {
    try {

      let currentThread = null;

      if (this._threads.length === 0) {
        currentThread = new Thread();
        this._threads.push(currentThread);
      } else {
        for (let thread of this._threads) {
          if (thread.status === 'idle') {
            currentThread = thread;
          }
        }
      }

      if (currentThread == null) {
        currentThread = new Thread();
        this._threads.push(currentThread);
      }

      if (
        typeof exeProcess !== 'undefined'
      ) {
        currentThread.send({
          'exeProcess': exeProcess,
          'arg': arg
        });
      }

      return currentThread;
    } catch (e) {
      console.error('[threads][index]', e);
      throw e;
    }
  }
}

setInterval(() => {
  for (let key in threadCollection._threads) {
    let timestamp = moment().subtract(5, 'seconds').format('x');
    let thread = threadCollection._threads[key];
    // let thread = this._threads[key];

    if (thread.status === 'idle' && thread.updated_at < timestamp) {
      console.log('thread.updated_at', thread.updated_at);

      console.log('kill process', thread.created_at);
      thread.kill();
      threadCollection._threads.splice(key);
    }
  }
}, 1);

class Threads {
  constructor(exeProcess = '', arg = []) {
    this._thread = threadCollection.run(exeProcess, arg);
  }

  received(callback) {
    return this._thread.received(callback)
  }
}

module.exports = (exeProcess = '', arg = []) => {
  return new Threads(exeProcess, arg);
};
