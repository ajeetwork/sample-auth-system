const errorCodeMapper = new Proxy({
  required: 'blank',
  enum: 'inclusion',
  minlength: 'too_short',
  maxlength: 'too_long',
}, {
  get(target, prop, receiver) {
    return target[prop] || prop;
  },
});

module.exports = (err) => ({
  code: 'ValidationError',
  message: err._message,
  details: Object.values(err.errors)
    .map((field) => {
      const fieldErr = field.properties || field;
      return ({
        name: fieldErr.path,
        type: fieldErr.type === 'user defined' ? fieldErr.message : errorCodeMapper[fieldErr.type],
        count: fieldErr.minlength || fieldErr.maxlength,
        message: fieldErr.message,
        value: fieldErr.value,
      });
    }),
});
