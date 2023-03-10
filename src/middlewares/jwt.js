const expressJwt = require('express-jwt');
const openRoutes = require('./openRoutes');

function authJwt() {
  return expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    isRevoked,
  }).unless({
    path: openRoutes,
  });
}

async function isRevoked(req, payload, done) {
  // if (!payload.isAdmin) {
  //   done(null, true);
  // }
  done();
}

module.exports = authJwt;
