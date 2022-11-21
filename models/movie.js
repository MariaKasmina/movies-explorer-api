const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  // страна создания фильма
  country: {
    type: String,
    required: true,
  },
  // режиссёр фильма
  director: {
    type: String,
    required: true,
  },
  // длительность фильма
  duration: {
    type: Number,
    required: true,
  },
  // год выпуска фильма
  year: {
    type: String,
    required: true,
  },
  // описание фильма
  description: {
    type: String,
    required: true,
  },
  // ссылка на постер к фильму
  image: {
    type: String,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
  },
  // ссылка на трейлер фильма
  trailerLink: {
    type: String,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
  },
  // миниатюрное изображение постера к фильму
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
  },
  // id пользователя, который сохранил фильм
  owner: {
    type: String,
    required: true,
  },
  // id фильма, который содержится в ответе сервиса MoviesExplorer
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
