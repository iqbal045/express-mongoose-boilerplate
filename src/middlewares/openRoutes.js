const config = require('config');

const api = config.get('API_URL');

const openRoutes = [
  // public routes that doesn't require authentication

  // For User
  {
    url: `${api}/user/auth/register`,
    method: ['POST', 'OPTIONS'],
  },
  {
    url: `${api}/user/auth/login`,
    method: ['POST', 'OPTIONS'],
  },
  {
    url: /\/api\/user\/auth\/verify(.*)/,
    method: ['GET', 'OPTIONS'],
  },
  {
    url: `${api}/user/verifyByOtp`,
    method: ['POST', 'OPTIONS'],
  },
  {
    url: `${api}/user/verify/otp`,
    method: ['POST', 'OPTIONS'],
  },
  {
    url: `${api}/user/auth/verify/resend`,
    method: ['POST', 'OPTIONS'],
  },
  {
    url: `${api}/user/auth/forget/password`,
    method: ['POST', 'OPTIONS'],
  },
  {
    url: `${api}/user/auth/reset/password`,
    method: ['POST', 'OPTIONS'],
  },

  // For Admin
  {
    url: `${api}/admin/auth/login`,
    method: ['POST', 'OPTIONS'],
  },
  {
    url: `${api}/admin/auth/register`,
    method: ['GET', 'OPTIONS'],
  },

  // common routes
  {
    url: '/',
    method: ['GET', 'OPTIONS'],
  },
  {
    url: '/*',
    method: ['GET', 'OPTIONS'],
  },
];

module.exports = openRoutes;
