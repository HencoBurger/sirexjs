'use strict';

const factory = {
  'logger': require(`./logger`),
  'restResponse': require(`./restResponse`),
  'exceptions': require(`./exceptions`),
  'routeRequest': require(`./routeRequest`),
  'validation': require(`./validation`),
  'thread': require(`./thread`)
}

module.exports = () => {
  try {
    let extention = {};
    for(let ext in factory) {
      let factoryItem = factory[ext];
      extention[ext] = factoryItem;
    }

    Object.assign(global, extention);

    return extention;
  } catch(e) {
    console.error(e);
  }
}
