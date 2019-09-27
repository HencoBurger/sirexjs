'use strict';

module.exports = {
  capitalized: (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }
}
