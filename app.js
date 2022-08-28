const express = require('express');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/auth');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

require('dotenv').config();

const { MONGO_CONNECT, NODE_ENV } = process.env;

const connection = NODE_ENV === 'production' ? MONGO_CONNECT : 'mongodb://localhost:27017/moviesdb';

mongoose.connect(connection, {
  useNewUrlParser: true,
});

const origin = [
  'https://bestmoviesexplorer.nomoredomains.club',
  'http://bestmoviesexplorer.nomoredomains.club',
  'http://localhost:3000',
  'http://api.bestmoviesexplorer.nomoredomains.sbs',
  'https://api.bestmoviesexplorer.nomoredomains.sbs',
];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (origin.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

app.use(requestLogger);

app.use(express.json());

app.use(authRouter);

app.use(auth);

app.use(usersRouter);
app.use(moviesRouter);

app.use(() => {
  throw new NotFoundError('Маршрут не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'Ошибка по умолчанию.'
        : message,
    });

  next(err);
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
