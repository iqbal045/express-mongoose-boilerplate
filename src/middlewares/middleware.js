const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Own middlewares
const authJwt = require('./jwt');

const middleware = [
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  morgan('dev'),
  authJwt(),
];

module.exports = app => {
  middleware.forEach(m => {
    app.use(m);
  });
};
