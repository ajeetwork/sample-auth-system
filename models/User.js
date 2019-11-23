const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const phone = require('phone');
const { isEmpty } = require('lodash');
const transformMongooseToJSON = require('./../helpers/transformMongooseToJSON');
const { signToken } = require('./../helpers/jwt');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: validator.isEmail,
      message: 'invalid',
    },
  },
  phone_number: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/^\+\d+$/, 'not_a_number'],
    minlength: 10,
    maxlength: 15,
    validate: (phoneNo) => {
      if (isEmpty(phone(phoneNo))) throw new Error('not_exist');
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  country_code: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: validator.isISO31661Alpha2,
      message: 'inclusion',
    },
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'n/a'],
  },
  birthdate: {
    type: Date,
    required: true,
    validate: (v) => {
      if (v > new Date()) throw new Error('in_the_future');
    },
  },
  avatar: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokens: {
    type: [{
      value: String,
      type: { type: String, enum: ['auth', 'reset'] },
    }],
  },
}, {
  toJSON: {
    hidden: ['password', '__v', '_id', 'createdAt'],
    transform: transformMongooseToJSON,
  },
});

userSchema.pre('save', async function beforeSave(next) {
  const user = this;
  if (!user.isModified('password')) return;
  user.password = await bcrypt.hash(user.password, 8);
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function generateToken(type) {
  const currentUser = this;
  const token = await signToken({ phone_number: currentUser.phone_number, type });
  await currentUser.updateOne({ $push: { tokens: { type, value: token } } });
  return token;
};

userSchema.methods.hasToken = function hasToken(token) {
  const currentUser = this;
  return currentUser.tokens.find((t) => t.value === token);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
