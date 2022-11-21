const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

function getMovies(req, res, next) {
  const id = req.user._id;
  return Movie.find({ owner: id })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
}

function addMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image, trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании фильма');
      } else next(err);
    });
}

const deleteMovie = (req, res, next) => {
  const id = req.params._id;

  Movie.findById(id)
    .orFail(() => new NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (!(movie.owner === req.user._id)) {
        return next(new ForbiddenError('Ошибка прав доступа'));
      }
      return movie.remove().then(() => res.send({ message: 'Фильм удален' }));
    }).catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
