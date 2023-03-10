const mongoose = require('mongoose');
const { User } = require('../../models/User');
const response = require('../../helpers/response');

exports.getUsers = async (req, res) => {
  try {
    const userList = await User.find().select('name email phone');

    return response.success(res, userList, 'Users fetched successfully.', 200);
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return response.error(res, {}, 'Invalid User Id.', 400);
    }

    const user = await User.findById(id);

    if (!user) {
      return response.error(res, {}, 'User not found.', 404);
    }

    return response.success(res, user, 'User fetched successfully.', 200);
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.getUsersCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments({});

    if (!userCount) {
      return response.error(
        res,
        {},
        'Error Occurred! Server was not counting any user.',
        404,
      );
    }

    return response.success(
      res,
      userCount,
      'User Count fetched successfully.',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};
