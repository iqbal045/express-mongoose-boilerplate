const config = require('config');

// user handlers
const authRoutes = require('./user/authRoutes');
const userRoutes = require('./user/userRoutes');

// admin handlers
const adminAuthRoutes = require('./admin/authRoutes');
const moderatorRoutes = require('./admin/moderatorRoutes');
const userRoutesForAdmin = require('./admin/userRoutes');

// env_config
const api = config.get('API_URL');

const routes = [
  // User Routes
  {
    path: `${api}/user/auth`,
    handler: authRoutes,
  },
  {
    path: `${api}/user`,
    handler: userRoutes,
  },

  // Admin Routes
  {
    path: `${api}/admin/auth`,
    handler: adminAuthRoutes,
  },
  {
    path: `${api}/admin/moderators`,
    handler: moderatorRoutes,
  },
  {
    path: `${api}/admin/users`,
    handler: userRoutesForAdmin,
  },

  // Common Routes
  {
    path: '/', // root route
    handler: (req, res) => {
      res.status(200).json({
        message: 'Welcome to our App.',
        success: true,
      });
    },
  },
  {
    path: '/*', // 404 response path
    handler: (req, res) => {
      res.status(404).json({
        message: `Error: 404, Url Not Found!`,
        success: false,
      });
    },
  },
];

module.exports = app => {
  routes.forEach(r => {
    if (r.path === '/') {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};
