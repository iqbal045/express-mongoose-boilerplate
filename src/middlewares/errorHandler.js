const multer = require('multer');
const response = require('../helpers/response');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err) {
    if (err.name === 'UnauthorizedError') {
      console.log(err);
      return response.error(res, err, 'User not authorized!', 401);
    }

    if (err.name === 'ValidationError') {
      return response.error(res, err, 'Validation Error!', 400);
    }

    if (err instanceof multer.MulterError) {
      return response.error(res, err, 'There was an upload error!', 406);
    }

    if (err.name === 'TypeError') {
      return response.error(
        res,
        err,
        'Error Occurred! There was a type error.',
        406,
      );
    }

    if (err.name === 'MongooseError') {
      return response.error(
        res,
        err,
        'Error Occurred! There was a database error.',
        500,
      );
    }

    return response.error(
      res,
      err,
      'Error Occurred! Unknown Error.',
      err.status || 500,
    );
  }
}

module.exports = errorHandler;
