const jwt = require('jsonwebtoken');
const UnauthorizedRequestError = require('../errors/unauthorized-request-err');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedRequestError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  const { NODE_ENV, JWT_SECRET } = process.env;
  const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedRequestError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
