const userRouter = require('express').Router();
const { getOr } = require('lodash/fp');
const { imageUploader } = require('../middlewares');
const { register, login } = require('../controllers/user');
const { ASSETS_PATH } = require('../initialize');


userRouter.post('/', imageUploader.single('avatar'), async (req, res) => {
  const avatar = getOr('', 'file.path')(req).replace(ASSETS_PATH, '');
  const user = await register({ ...req.body, avatar });
  res.status(201).send(user);
});


userRouter.post('/auth', async (req, res) => {
  const { phone_number, password } = req.body;
  const { token, user } = await login(phone_number, password);
  res.send({ token, user });
});

module.exports = userRouter;
