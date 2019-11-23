const yup = require('yup');
const phone = require('phone');
const validator = require('validator');
const { isEmpty } = require('lodash');
const User = require('./../models/User');
const CustomError = require('./../helpers/customError');

const registerSchema = yup.object().shape({
  first_name: yup.string().trim().required(),
  last_name: yup.string().trim().required(),
  email: yup.string().email('invalid'),
  avatar: yup.string().trim().required(),
  country_code: yup.string().trim().test('', 'inclusion', validator.isISO31661Alpha2),
  gender: yup.string().required().oneOf(['male', 'female', 'n/a']),
  birthdate: yup.string().trim().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'invalid'),
  password: yup.string().trim().required().min(5),
  phone_number: yup.string().trim().required()
    .min(10)
    .max(15)
    .matches(/^\+\d+$/, 'not_a_number')
    .test('', 'invalid', (v) => !isEmpty(phone(v))),
});


const register = async (data) => {
  await registerSchema.validate(data, { abortEarly: false });
  const user = new User(data);
  return user.save();
};

const loginSchema = yup.object().shape({
  password: yup.string().trim().required().min(5),
  phone_number: yup.string().trim().required()
    .min(10)
    .max(15)
    .matches(/^\+\d+$/, 'not_a_number')
    .test('', 'invalid', (v) => !isEmpty(phone(v))),
});


const login = async (phone_number, password) => {
  await loginSchema.validate({ phone_number, password }, { abortEarly: false });
  const user = await User.findOne({ phone_number });
  if (!user) throw new CustomError(401, 'INVALID_CREDENTIALS');
  const validPassword = await user.validatePassword(password);
  if (!validPassword) throw new CustomError(401, 'INVALID_CREDENTIALS');
  const token = await user.generateToken('auth');
  return { token, user };
};

module.exports = {
  register,
  login,
};
