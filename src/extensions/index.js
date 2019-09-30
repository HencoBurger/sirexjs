'use strict';

const factory = {
  'logger': require(`./logger`),
  'restResponse': require(`./restResponse`),
  'exceptions': require(`./exceptions`),
  'routeRequest': require(`./routeRequest`),
  'validation': require(`./validation`),
}

module.exports = () => {
  try {
    let extention = {};
    for(let ext in factory) {
      let factoryItem = factory[ext];
      console.log(ext);
      // Check to se if its a class or a function.
      // Classes gets instantiated
      // if(factoryItem.name === '') {
      //   extention[ext] = factoryItem;
      // } else {
      //   extention[ext] = function() { return new factoryItem() };
      // }
      extention[ext] = factoryItem;
    }

    Object.assign(global, extention);

    return extention;
  } catch(e) {
    console.error(e);
  }
}
