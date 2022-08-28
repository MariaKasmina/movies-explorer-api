const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUserInfo,
  getCurrentUserInfo,
} = require('../controllers/users');

// возвращает данные текущего пользователя
usersRouter.get('/users/me', getCurrentUserInfo);

// обновление данных текущего пользователя
usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateUserInfo);

module.exports = usersRouter;
