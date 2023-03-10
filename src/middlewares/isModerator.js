const jwt_decode = require('jwt-decode');

const is_Admin = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = await jwt_decode(token);
    if (decoded.role === 'admin' || decoded.role === 'moderator') {
      next();
    } else {
      res.status(403).json({
        message: 'You are not authorized to access this route.',
      });
    }
  } else {
    res.status(401).json({
      message: 'Error Occurred! The user is not authenticated.',
    });
  }
};

module.exports = is_Admin;
