const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'kwjfg37432(@#*$JDKDWEJFE93ehwfweg)' } = process.env;

const signToken = (payload, opts = {}) => new Promise((resolve, reject) => {
  jwt.sign(payload, JWT_SECRET, opts, (err, token) => {
    if (err) return reject(err);
    return resolve(token);
  });
});


const verifyToken = (token, opts = {}) => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_SECRET, opts, (err, payload) => {
    if (err) return reject(err);
    return resolve(payload);
  });
});

module.exports = {
  signToken,
  verifyToken,
};
