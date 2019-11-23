module.exports = (err) => ({
  code: 'ValidationError',
  message: err.message,
  details: [{
    name: err.field,
    type: err.code,
  }],
});
