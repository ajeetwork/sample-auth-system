const mongoose = require('mongoose');
const yup = require('yup');
const mapMongooseError = require('./mongoose');
const mapMongoError = require('./mongo');
const mapMulterError = require('./multer');
const mapYupError = require('./yup');
const mapDetailsToObj = require('./mapDetailsToObj');

module.exports = (err) => {
  let customRes;
  let statusCode = Number(err.statusCode) || 500;
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    customRes = mapMongooseError(err);
  } else if (err instanceof yup.ValidationError) {
    statusCode = 422;
    customRes = mapYupError(err);
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 422;
    customRes = mapMongoError(err);
  } else if (err.name === 'MulterError') {
    statusCode = 422;
    customRes = mapMulterError(err);
  } else if (statusCode < 500) {
    customRes = {
      code: err.code,
      message: err.message,
      details: err.details || [],
    };
  } else {
    customRes = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      details: [],
    };
  }
  return ({
    message: customRes.message,
    code: customRes.code,
    errors: mapDetailsToObj(customRes.details),
    statusCode,
  });
};
