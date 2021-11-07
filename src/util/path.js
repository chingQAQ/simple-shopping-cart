const { join } = require('path');

module.exports.resolve = (...path) => {
  return join(__dirname, '..', ...path);
};
