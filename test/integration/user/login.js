const mongoose = require('mongoose');
const { expect } = require('chai');
// const _ = require('lodash');
const { request, wipeDB } = require('../common');
const sampleUser = require('./data.json');


const { User } = mongoose.models;
const loginPath = '/api/user/auth';
describe(`POST ${loginPath}`, () => {
  beforeEach(async () => {
    await wipeDB();
  });


  it('should login user with correct password and return token', async () => {
    await User.create(sampleUser);
    const { body: response } = await request.post(loginPath)
      .send({ phone_number: sampleUser.phone_number, password: sampleUser.password })
      .expect(200);
    const userInDB = await User.findOne({ phone_number: sampleUser.phone_number }).lean();
    expect(response).to.have.property('token');
    expect(userInDB.tokens[0]).to.include({ type: 'auth', value: response.token });
  });


  it('should return 401 on wrong phone_number', async () => {
    await User.create(sampleUser);
    const { body: response } = await request.post(loginPath)
      .send({ phone_number: '+201000000000', password: sampleUser.password })
      .expect(401);

    expect(response).to.have.property('code', 'INVALID_CREDENTIALS');
  });


  it('should return 401 on wrong password', async () => {
    await User.create(sampleUser);
    const { body: response } = await request.post(loginPath)
      .send({ phone_number: sampleUser.phone_number, password: 'wrong-pass' })
      .expect(401);

    expect(response).to.have.property('code', 'INVALID_CREDENTIALS');
  });
});
