const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { addUser, login } = require('../controllers/users');

authRouter.post('/signup', celebrate({
  body: Joi.object().keys(
    {
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  ),
}), addUser);

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = authRouter;
