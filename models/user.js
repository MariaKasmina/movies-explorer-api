const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedRequestError = require('../errors/unauthorized-request-err');

const userSchema = new mongoose.Schema({
  // имя пользователя
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Музыкант',
  },
  // электронная почта
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
    },
  },
  // пароль
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // ищем пльзователя по email
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedRequestError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password) // если пользователь найден, сверяем пароль
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedRequestError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
