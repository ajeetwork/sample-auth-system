const { difference } = require('lodash');

module.exports = (requiredParameters = [], where = 'body') => (req, res, next) => {
  const sentKeys = Object.keys(req[where]);
  const missingParams = difference(requiredParameters, sentKeys);
  if (!missingParams.length) return next();
  res.status(422).json({
    message: `required parameters: ${missingParams.join(', ')}`,
    details: missingParams.map((param) => ({
      name: param,
      type: 'required',
    })),
  });
};
