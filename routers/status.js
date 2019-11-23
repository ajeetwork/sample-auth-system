const statusRouter = require('express').Router();
const { authentication } = require('./../middlewares');
const { create } = require('../controllers/status');

statusRouter.post('/', authentication, async (req, res) => {
  const { user: { id: userId }, body: { status: text } } = req;
  const status = await create(text, userId);
  res.status(201).send(status);
});


module.exports = statusRouter;
