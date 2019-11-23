const mongoose = require('mongoose');

const { MONGO_URL = 'mongodb://localhost:27017/cognitev' } = process.env;

mongoose.connect(MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, (err) => {
  if (!err) console.info('successfully connected to database');
  else console.error(err);
});
