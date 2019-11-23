const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('./../../index');

const request = supertest(app);


const wipeDB = async () => {
  const promises = Object.values(mongoose.models).map((Model) => Model.deleteMany({}));
  return Promise.all(promises);
};

module.exports = {
  request,
  wipeDB,
};
