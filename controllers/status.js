const yup = require('yup');
const Status = require('./../models/Status');


const statusSchema = yup.object().shape({
  text: yup.string().trim().required().min(5),
});


const create = async (text, userId) => {
  await statusSchema.validate({ text }, { abortEarly: false });
  const status = new Status({
    text,
    userId,
  });
  return status.save();
};


module.exports = {
  create,
};
