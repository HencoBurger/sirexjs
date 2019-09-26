'use strict';

const factory = {
  'logger': require(`./logger`),
  'restResponse': require(`./restResponse`),
  'exceptions': require(`./exceptions`)
}

module.exports = () => {
  let extention = {};
  for(let ext in factory) {
    extention[ext] = new factory[ext]();
  }
  console.log('run');
  Object.assign(global, extention);
}
