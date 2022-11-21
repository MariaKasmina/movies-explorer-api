const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else res.send(user);
  })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

const addUser = (req, res, next) => {
  const {
    name, password, email,
  } = req.body;

  return bcrypt.hash(password, 10).then((hash) => User.create({
    name, email, password: hash,
  }) // чтобы не возвращался хеш пароля описываем поля, которые нужны в ответе
    .then((user) => res.status(201).send({
      id: user._id, name: user.name, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    }));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.send({ token });
    }).catch(next);
};

module.exports = {
  getCurrentUserInfo,
  updateUserInfo,
  addUser,
  login,
};
