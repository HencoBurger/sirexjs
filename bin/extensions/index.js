'use strict';

const factory = {
  'logger': require(`./logger`),
  'restResponse': require(`./restResponse`),
  'exceptions': require(`./exceptions`),
  'routeRequest': require(`./routeRequest`),
  'validation': require(`./validation`),
  'threads': require(`./threads`)
};

module.exports = (() => {
  try {
    let extention = {};
    for(let ext in factory) {
      let factoryItem = factory[ext];
      extention[ext] = factoryItem;
    }

    return extention;
  } catch(e) {
    console.error(e);
  }
})();
