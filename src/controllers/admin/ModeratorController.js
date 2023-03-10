const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const transporter = require('../../helpers/nodemailer');
const { Admin } = require('../../models/Admin');
const response = require('../../helpers/response');

// Get All Moderators
exports.getModerators = async (req, res) => {
  try {
    const moderatorList = await Admin.find({ role: 'moderator' });
    return response.success(
      res,
      moderatorList,
      'Moderators fetched successfully',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

// Create Moderator
exports.createModerator = async (req, res) => {
  try {
    const { name, email } = req.body;

    const moderator = await Admin.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: bcrypt.hashSync('moderator000', 10),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    // create email
    const mailOptions = {
      from: 'noreplay@galileobox.com',
      to: `${email}`,
      subject: 'OTP from GalileoBox',
      text: `Here is your credentials to login to GalileoBox.\n\n
      Email: ${email}\n
      Password: moderator000\n`,
    };

    // send email
    transporter.sendMail(mailOptions, error => {
      if (error) {
        return res.status(500).json({ error });
      }
    });

    return response.success(
      res,
      moderator,
      'Moderator Created Successfully.',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

// Get Moderator by Id.
exports.getModeratorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return response.error(res, {}, 'Invalid Moderator Id.', 400);
    }

    const moderator = await Admin.findById(id);
    if (!moderator) {
      return response.error(res, {}, 'Moderator not found.', 400);
    }

    return response.success(
      res,
      moderator,
      'Moderator fetched successfully',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

// Update Moderator by Id.
exports.updateModeratorById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Check if the id is valid
    const moderator = await Admin.findById(id);
    if (!mongoose.isValidObjectId(id) && !moderator) {
      return response.error(res, {}, 'Invalid Moderator Id.', 400);
    }

    // Update Moderator
    moderator.name = name;
    moderator.email = email;
    moderator.password = password;
    await moderator.save();

    return response.success(
      res,
      moderator,
      'Moderator Updated Successfully.',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

// Delete Moderator by Id.
exports.deleteModeratorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is valid
    const moderator = await Admin.findById(id);
    if (!mongoose.isValidObjectId(id) && !moderator) {
      return response.error(res, {}, 'Invalid Moderator Id.', 400);
    }

    // Delete Moderator
    await moderator.remove();

    return response.success(
      res,
      moderator,
      'Moderator Deleted Successfully.',
      200,
    );
  } catch (err) {
    return res.status(err.status || 500).json({
      message: `Error Occurred.`,
      success: false,
      error: {
        _error: err.name,
        _message: err.message,
      },
    });
  }
};

// Moderator Count
exports.getModeratorsCount = async (req, res) => {
  try {
    const moderatorCount = await Admin.countDocuments({ role: 'moderator' });

    if (!moderatorCount) {
      return response.error(
        res,
        {},
        'Error Occurred! Server was not counting any Moderator.',
        404,
      );
    }

    return response.success(res, moderatorCount, 'Moderator Counted.', 200);
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

// Moderator Status Change by Id
exports.moderatorStatusChange = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is valid
    const moderator = await Admin.findById(id);
    if (!mongoose.isValidObjectId(id) && !moderator) {
      return response.error(res, {}, 'Invalid Moderator Id.', 400);
    }

    // Toggle Update Moderator
    moderator.isActive === true
      ? (moderator.isActive = false)
      : (moderator.isActive = true);
    await moderator.save();

    return response.success(
      res,
      moderator,
      'Moderator Status Updated Successfully.',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};
