'use strict';

const factory = {
  'logger': require(`./logger`),
  'restResponse': require(`./restResponse`),
  'exceptions': require(`./exceptions`),
  'routeRequest': require(`./routeRequest`)
}

module.exports = () => {
  let extention = {};
  for(let ext in factory) {
    let factoryItem = factory[ext];

    // Check to se if its a class or a function.
    // Classes gets instantiated
    if(factoryItem.name === '') {
      extention[ext] = factoryItem;
    } else {
      extention[ext] = new factoryItem();
    }
  }

  Object.assign(global, extention);

  return extention;
}
