'use strict';

const childProcess = require('child_process');
const moment = require('moment');

class Thread {

  constructor(status) {
    let timestamp = moment().format('x');
    this._threadMessage = null;
    this._threadMessageRx = false;
    this._threadError = null;
    this._threadErrorRx = false;
    this._threadExit = null;
    this._threadExitRx = false;
    this._payload = null;
    this._status = status;
    this._created_at = timestamp;
    this._updated_at = timestamp;

    if (status !== 'pool') {
      this.run();
    }
  }

  run() {
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
  }

  onMessage(response) {
    this._threadMessageRx = true;
    this._threadMessage = response;
  }

  onError(error) {
    this._threadErrorRx = true;
    this._threadError = error;
    this._thread.kill();
  }

  onExit(exit) {
    this._threadExitRx = true;
    this._threadExitRx = exit;
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
    return this._thread.kill('SIGINT');
  }

  setPayload(payload) {
    this._payload = payload;
  }

  send() {
    if (this._payload !== null) {
      this.updated_at = this.timestamp;
      this.status = 'active';
      this._thread.send(this._payload);
      this._payload = null;
    }
  }

  received() {
    try {
      return new Promise((resolve, reject) => {
        let receivedInterval = setInterval(() => {
          if (this._threadMessageRx) {
            this.status = 'idle';
            this.updated_at = this.timestamp;
            resolve(this._threadMessage);
            this._threadMessageRx = false;
            clearInterval(receivedInterval);
          }
          if (this._threadErrorRx) {
            this.status = 'idle';
            this.updated_at = this.timestamp;
            reject(this._threadError);
            this._threadErrorRx = false;
            clearInterval(receivedInterval);
          }
          if (this._threadExitRx) {
            this.status = 'idle';
            this.updated_at = this.timestamp;
            reject(this._threadExit);
            this._threadExitRx = false;
            clearInterval(receivedInterval);
          }
        }, 0);
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

}

const threadCollection = {
  _runningThreads: 0,
  _threads: [],
  run(exeProcess = '', arg = []) {
    try {

      let currentThread = null;

      if (this._threads.length === 0) {
        currentThread = new Thread('pool');
        this._threads.push(currentThread);
      } else {
        for (let thread of this._threads) {
          if (thread.status === 'idle') {
            currentThread = thread;
          }
        }
      }

      if (currentThread == null) {
        currentThread = new Thread('pool');
        this._threads.push(currentThread);
      }

      if (
        typeof exeProcess !== 'undefined'
      ) {
        currentThread.setPayload({
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
};

const treadLoop = () => {
  for (let key in threadCollection._threads) {
    let timestamp = moment().subtract(5, 'seconds').format('x');
    let thread = threadCollection._threads[key];

    // Create new thread and send the payload
    // Only initiate thread if pool is less and equel to 4
    if (thread.status === 'pool' && threadCollection._runningThreads <= 5) {
      threadCollection._runningThreads = threadCollection._runningThreads + 1;
      thread.run();
      thread.send();
    }
    // Process are killed ofter 5 seconds and inactivity
    if (thread.status === 'idle' && thread.updated_at < timestamp) {
      threadCollection._runningThreads = threadCollection._runningThreads - 1;
      thread.status = 'kill';
      thread.kill();
      threadCollection._threads.splice(key, 1);
      // Initiate thread as active
    } else if (
      thread.status !== 'kill' &&
      thread.status !== 'pool'
    ) {
      thread.send();
    }
  }
};

// Function runs every miliseconds
setInterval(treadLoop, 0);

class Threads {
  constructor(exeProcess = '', arg = []) {
    this._thread = threadCollection.run(exeProcess, arg);
  }

  received() {
    return new Promise((resolve, reject) => {
      this._thread
        .received()
        .then((result) => {
          resolve(result);
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });
    });
  }
}

module.exports = (exeProcess = '', arg = []) => {
  return new Threads(exeProcess, arg);
};
