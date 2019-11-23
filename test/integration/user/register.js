const mongoose = require('mongoose');
const { expect } = require('chai');
const _ = require('lodash');
const { request, wipeDB } = require('../common');
const sampleUser = require('./data.json');


const { User } = mongoose.models;

const registerPath = '/api/user';
describe(`POST ${registerPath}`, () => {
  beforeEach(async () => {
    await wipeDB();
  });


  it('should add user with valid data', async () => {
    const { body: response } = await request.post(registerPath)
      .field('first_name', sampleUser.first_name)
      .field('last_name', sampleUser.last_name)
      .field('email', sampleUser.email)
      .field('country_code', sampleUser.country_code)
      .field('gender', sampleUser.gender)
      .field('phone_number', sampleUser.phone_number)
      .field('password', sampleUser.password)
      .field('birthdate', sampleUser.birthdate)
      .attach('avatar', sampleUser.avatar)
      .expect(201);

    const registerdUser = await User.findById(response.id);
    expect(registerdUser.toObject()).to.include(
      _.pick(sampleUser, ['first_name', 'last_name', 'email', 'country_code', 'gender', 'phone_number']),
    );
    expect(response).to.not.have.all
      .keys('password', '_id', '__v');
  });

  it('should add user without email', async () => {
    const { body: response } = await request.post(registerPath)
      .field('first_name', sampleUser.first_name)
      .field('last_name', sampleUser.last_name)
      .field('country_code', sampleUser.country_code)
      .field('gender', sampleUser.gender)
      .field('phone_number', sampleUser.phone_number)
      .field('password', sampleUser.password)
      .field('birthdate', sampleUser.birthdate)
      .attach('avatar', sampleUser.avatar)
      .expect(201);
    const registerdUser = await User.findById(response.id);
    expect(registerdUser.toObject()).to.include(
      _.pick(sampleUser, ['first_name', 'last_name', 'country_code', 'gender', 'phone_number']),
    );
  });


  it('should not send hidden fields', async () => {
    const { body: response } = await request.post(registerPath)
      .field('first_name', sampleUser.first_name)
      .field('last_name', sampleUser.last_name)
      .field('email', sampleUser.email)
      .field('country_code', sampleUser.country_code)
      .field('gender', sampleUser.gender)
      .field('phone_number', sampleUser.phone_number)
      .field('password', sampleUser.password)
      .field('birthdate', sampleUser.birthdate)
      .attach('avatar', sampleUser.avatar)
      .expect(201);
    expect(response).to.not.have.all
      .keys('password', '_id', '__v');
  });

  it('should hash password correctly', async () => {
    const { body: response } = await request.post(registerPath)
      .field('first_name', sampleUser.first_name)
      .field('last_name', sampleUser.last_name)
      .field('country_code', sampleUser.country_code)
      .field('gender', sampleUser.gender)
      .field('phone_number', sampleUser.phone_number)
      .field('password', sampleUser.password)
      .field('birthdate', sampleUser.birthdate)
      .attach('avatar', sampleUser.avatar)
      .expect(201);
    const registerdUser = await User.findById(response.id);
    const passwordMatch = await registerdUser.validatePassword(sampleUser.password);
    expect(passwordMatch).to.equal(true);
  });


  it('should error in case of missing data', async () => {
    const { body: response } = await request.post(registerPath)
      .field('phone_number', '+788')
      .field('gender', 'blah')
      .field('country_code', 'tet')
      .field('email', 'testtest')
      .expect(422);

    expect(response.errors).to.deep.equal({
      first_name: [{ error: 'blank' }],
      last_name: [{ error: 'blank' }],
      email: [{ error: 'invalid' }],
      avatar: [{ error: 'blank' }],
      country_code: [{ error: 'inclusion' }],
      gender: [{ error: 'inclusion' }],
      birthdate: [{ error: 'blank' }],
      password: [{ error: 'blank' }],
      phone_number: [{ error: 'too_short' }, { error: 'invalid' }],
    });
  });
});
