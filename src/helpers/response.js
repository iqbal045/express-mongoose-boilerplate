const config = require('config');

const env = config.get('env');

// Success response
const success = (res, data, message, status) => {
  res.status(status || 200).json({
    message,
    success: true,
    status: status || 200,
    data,
  });
};

// Error response
const error = (res, err, message, status) => {
  res.status(status || 500).json({
    message,
    success: false,
    status: status || 500,
    error:
      env === 'production' ? {} : { _error: err.name, _message: err.message },
  });
};

// Export the helper functions
module.exports = { success, error };
