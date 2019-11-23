const userRouter = require('express').Router();
const { get } = require('lodash/fp');
const { imageUploader } = require('../middlewares');
const { register, login } = require('../controllers/user');

userRouter.post('/', imageUploader.single('avatar'), async (req, res) => {
  const user = await register({ ...req.body, avatar: get('file.path')(req) });
  res.status(201).send(user);
});


userRouter.post('/auth', async (req, res) => {
  const { phone_number, password } = req.body;
  const { token, user } = await login(phone_number, password);
  res.send({ token, user });
});

module.exports = userRouter;
