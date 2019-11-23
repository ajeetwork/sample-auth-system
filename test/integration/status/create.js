const mongoose = require('mongoose');
const { expect } = require('chai');
// const _ = require('lodash');
const { request, wipeDB } = require('../common');
const { sampleUser, sampleStatus } = require('./data.json');


const { User } = mongoose.models;
const statusPath = '/api/status';
describe(`POST ${statusPath}`, () => {
  beforeEach(async () => {
    await wipeDB();
  });


  it('should create status for authenticated Users', async () => {
    const currentUser = await User.create(sampleUser);
    const token = await currentUser.generateToken('auth');
    const { body: response } = await request.post(statusPath)
      .send({ status: sampleStatus, 'auth-token': token })
      .expect(201);

    expect(response).to.have.property('text', sampleStatus);
    expect(response).to.have.property('userId', currentUser.id);
  });


  it('should not allow unauthenticated users', async () => {
    const { body: response } = await request.post(statusPath)
      .send({ status: sampleStatus, 'auth-token': 'wrongtoken' })
      .expect(401);

    expect(response).to.have.property('code', 'AUTHENTICATION_REQUIRED');
  });

  it('should not allow unauthenticated users', async () => {
    const { body: response } = await request.post(statusPath)
      .send({ status: sampleStatus, 'auth-token': 'wrongtoken' })
      .expect(401);

    expect(response).to.have.property('code', 'AUTHENTICATION_REQUIRED');
  });
});
