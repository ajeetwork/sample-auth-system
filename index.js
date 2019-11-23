require('dotenv').config();
const express = require('express');
require('express-async-errors');
const CustomError = require('./helpers/customError');
const { errorHandler } = require('./middlewares');
const userRouter = require('./routers/user');
const statusRouter = require('./routers/status');
require('./db');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/api', (req, res) => res.send());
app.use('/api/user', userRouter);
app.use('/api/status', statusRouter);


app.use((req, res, next) => { next(new CustomError(404, 'ROUTE_NOT_FOUND')); });
app.use(errorHandler);


if (require.main === module) {
  const { PORT = 3000 } = process.env;
  app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
}


module.exports = app;
