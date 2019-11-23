const { omit } = require('lodash');

module.exports = (doc, ret, options) => {
  const result = omit(ret, options.hidden);
  result.id = ret._id;
  return result;
};
