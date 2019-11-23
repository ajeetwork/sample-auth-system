const errorCodeMapper = new Proxy({
  required: 'blank',
  oneOf: 'inclusion',
  min: 'too_short',
  max: 'too_long',
}, {
  get(target, prop, receiver) {
    return target[prop] || prop;
  },
});


module.exports = (err) => ({
  code: 'ValidationError',
  message: err.message,
  details: err.inner
    .map((field) => ({
      name: field.path,
      type: !field.type ? field.message : errorCodeMapper[field.type],
      count: field.params.min || field.params.max,
      message: field.message,
      value: field.value,
    })),
});
