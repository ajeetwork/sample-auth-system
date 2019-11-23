const errorMapper = require('./../helpers/errorMapper');

module.exports = (err, req, res, next) => {
  const customRes = errorMapper(err);
  // unhandled error
  if (customRes.statusCode >= 500) console.error(err);
  res.status(customRes.statusCode).json(customRes);
};
