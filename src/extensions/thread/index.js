'use strict';

const path = require('path');
const childProcess = require('child_process');

class Threads {

  constructor(runProcess) {
    try {
      this.thread = null;

      this.thread = childProcess.fork(`${process.cwd()}/${runProcess}`, []);


      return this;
    } catch (e) {
      console.error('[MultiThread][constructor]');
      console.error(e);
      throw e;
    }
  }

  send(input) {
    return new Promise((resolve, reject) => {
      console.log({
        'local': true,
        dirname: process.cwd(),
        input: input
      });
      this.thread.send({
        dirname: process.cwd(),
        input: input
      });

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

export default {
  _treads: null,
  create(exeProcess) {
    if (this._treads === null) {
      this._treads = {};
    }

    if (typeof this._treads[exeProcess] === 'undefined') {
      this._treads[exeProcess] = new Threads(exeProcess);
    }

    return this._treads[exeProcess];
  },
  tread(exeProcess) {

    let tread = null;

    if (typeof this._treads[exeProcess] !== 'undefined') {
      tread = this._treads[exeProcess];
    }

    return tread;
  },
  list() {
    return (this._treads === null) ? [] : Object.keys(this._treads);
  }
}
