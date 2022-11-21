const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

const linkRegexp = new RegExp('(http|https?):\\/\\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+(\\.ru?|\\.com?|\\.net?)[-A-Za-z0-9+&@#/%=~_|]+');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(linkRegexp).required(),
    trailerLink: Joi.string().pattern(linkRegexp).required(),
    thumbnail: Joi.string().pattern(linkRegexp).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);

moviesRouter.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
