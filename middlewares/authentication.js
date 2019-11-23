const CustomError = require('./../helpers/customError');
const { verifyToken } = require('../helpers/jwt');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization || req.body['auth-token'];
  if (!authorization) throw new CustomError(401, 'AUTHENTICATION_REQUIRED', 'No token provided');
  const token = authorization.replace('Bearer', '').trim();
  const tokenData = await verifyToken(token)
    .catch((err) => {
      throw new CustomError(401, 'AUTHENTICATION_REQUIRED', 'invalid token');
    });
  const currentUser = await User.findOne({ phone_number: tokenData.phone_number });
  if (!currentUser) throw new CustomError(401, 'AUTHENTICATION_REQUIRED', 'failed to authenticate token');
  if (!currentUser.hasToken(token)) throw new CustomError(401, 'AUTHENTICATION_REQUIRED', 'failed to authenticate token');
  req.token = token;
  req.tokenData = tokenData;
  req.user = currentUser;
  return next();
};
