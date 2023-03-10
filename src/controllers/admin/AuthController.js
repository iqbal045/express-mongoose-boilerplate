const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../../models/Admin');
const response = require('../../helpers/response');

exports.login = async (req, res) => {
  try {
    // check admin
    const admin = await Admin.findOne({ email: req.body.email }).select(
      '+password',
    );
    if (!admin) {
      return response.error(res, {}, 'Admin not found!', 404);
    }

    // check password
    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      admin.password,
    );
    if (admin && !isValidPassword) {
      return response.error(
        res,
        {},
        'Credentials not match. Please try again!',
        401,
      );
    }

    if (!admin.isAdmin) {
      return response.error(res, {}, 'User not authorized!', 403);
    }

    // generate a token
    const token = jwt.sign(
      {
        admin_id: admin.id,
        isAdmin: admin.isAdmin,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '999y' },
    );

    // return response
    return response.success(
      res,
      {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        token,
      },
      'Login Successful!',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

// Admin Register
exports.register = async (req, res) => {
  try {
    // admin create
    const admin = await Admin.findOneAndUpdate(
      {
        email: 'admin@server.com',
      },
      {
        name: 'Admin',
        phone: '01700000000',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
        role: 'admin',
        isActive: true,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return response.success(res, admin, 'Admin Created Successfully!', 201);
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};
