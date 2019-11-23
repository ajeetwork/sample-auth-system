const { reduce } = require('lodash/fp');

module.exports = reduce((agg, ele) => {
  const mappedError = { error: ele.type };
  return ({ ...agg, [ele.name]: (agg[ele.name] || []).concat(mappedError) });
}, {});
