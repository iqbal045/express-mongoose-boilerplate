const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../../helpers/nodemailer');
const crypter = require('../../helpers/crypter');
const { User } = require('../../models/User');
const { Otp } = require('../../models/Otp');
const response = require('../../helpers/response');

const url = config.get('APP_URL');
const api = config.get('API_URL');

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      // mobile,
      password,
    } = req.body;

    const user = new User({
      name,
      email,
      // mobile,
      password: bcrypt.hashSync(password, 10),
    });
    // create user
    await user.save();

    // create otp
    const otpNumber = Math.floor(Math.random() * 99999);
    const otp = new Otp({
      user_id: user.id,
      otp: otpNumber,
      expire_at: new Date(new Date().getTime() + 60 * 5000),
    });
    // save otp to db
    await otp.save();

    // create email
    const mailOptions = {
      from: 'noreplay@galileobox.com',
      to: `${user.email}`,
      subject: 'OTP from GalileoBox',
      text: `Your OTP is: ${otpNumber} This OTP is valid for 5 minutes.
            Or go to this link to verify your account: 
            ${url + api}/user/auth/verify?u=${crypter.encrypt(
        user.email,
      )}&otp=${crypter.encrypt(otpNumber)}`,
    };

    // send email
    transporter.sendMail(mailOptions, error => {
      if (error) {
        return res.status(500).json({ error });
      }
    });

    return response.success(
      res,
      {
        name: user.name,
        email: user.email,
        // mobile: user.mobile,
        isVerified: user.isVerified,
        created_at: user.created_at,
        updated_at: user.created_at,
      },
      'User successfully registered. Verify your email to activate your account.',
      201,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.login = async (req, res) => {
  try {
    // check user
    const user = await User.findOne({ email: req.body.email }).select(
      'name email +password isAdmin',
    );
    if (!user && !user.isVerified) {
      return response.error(res, {}, 'Authentication Field!', 401);
    }

    // check password
    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      user.password,
    );
    if (user && !isValidPassword) {
      return response.error(
        res,
        {},
        'Credentials not match. Please try again!',
        401,
      );
    }

    // generate a token
    const token = jwt.sign(
      {
        user_id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '99y' },
    );

    return response.success(
      res,
      {
        user: {
          name: user.name,
          email: user.email,
          // phone: user.phone,
        },
        token,
      },
      'Login Successfully!',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.verifyByLink = async (req, res) => {
  try {
    const { u, otp } = req.query;

    const decodeEmail = crypter.decrypt(u);
    const decodeOtp = crypter.decrypt(otp);

    // Validating User
    const user = await User.findOne({ email: decodeEmail });
    if (!user) {
      return res.send('<h2 style="text-align:center;">Invalid User</h2>');
    }
    if (user.isVerified) {
      return res.send(
        '<h2 style="text-align:center;">User Already Verified</h2>',
      );
    }

    // Validating OTP
    const otpData = await Otp.findOne({ otp: decodeOtp, user_id: user.id });
    if (!otpData || otpData.user_id.toString() !== user.id.toString()) {
      return res.send('<h2 style="text-align:center;">Invalid OTP</h2>');
    }
    if (otpData.expire_at < new Date().getTime()) {
      return res.send(
        '<h2 style="text-align:center;">The link is expired.</h2>',
      );
    }

    // Update User
    await User.findOneAndUpdate(
      { email: decodeEmail },
      { isVerified: true },
      { new: true },
    );

    // Delete OTP
    await Otp.findOneAndDelete({ otp: decodeOtp, user_id: user.id });

    return res.send(
      '<h2 style="text-align:center;">Your account is verified successfully. Please login to continue.</h2>',
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.verifyByOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validating User
    const user = await User.findOne({ email });
    if (!user) {
      return response.error(res, {}, 'Invalid User', 400);
    }
    if (user.isVerified) {
      return response.error(res, {}, 'User Already Verified', 400);
    }

    // Validating OTP
    const otpData = await Otp.findOne({ otp, user_id: user.id });
    if (!otpData || otpData.user_id.toString() !== user.id.toString()) {
      return response.error(res, {}, 'Invalid OTP.', 400);
    }
    if (otpData.expire_at < new Date().getTime()) {
      return response.error(res, {}, 'OTP is expired.', 400);
    }

    // Update User
    await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

    // Delete OTP
    await Otp.findOneAndDelete({ otp, user_id: user.id });

    return response.success(
      res,
      {},
      'Your account is verified successfully.',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.verifyResend = async (req, res) => {
  try {
    const { email } = req.body;

    // Validating User
    const user = await User.findOne({ email });
    if (!user) {
      return response.error(
        res,
        {},
        "You don't have any user ID please register.",
        400,
      );
    }
    if (user.isVerified === true) {
      return response.error(res, {}, 'You are already verified.', 400);
    }

    // generate Otp
    const otpNumber = Math.floor(Math.random() * 9999);

    // update otp and save to db
    await Otp.findOneAndUpdate(
      { user_id: user.id },
      { otp: otpNumber, expire_at: new Date(new Date().getTime() + 60 * 5000) },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    // create email
    const mailOptions = {
      from: 'noreplay@galileobox.com',
      to: `${user.email}`,
      subject: 'OTP from GalileoBox',
      text: `Your OTP is: ${otpNumber} This OTP is valid for 5 minutes.
            Or go to this link to verify your account: 
            ${url + api}/user/auth/verify?u=${crypter.encrypt(
        user.email,
      )}&otp=${crypter.encrypt(otpNumber)}`,
    };

    // send email
    transporter.sendMail(mailOptions, error => {
      if (error) {
        return res.status(500).json({ error });
      }
    });

    return response.success(
      res,
      {},
      'Otp was sent to your email. Please verify your email to activate your account.',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validating User
    const user = await User.findOne({ email });
    if (!user) {
      return response.error(res, {}, "You don't have any user ID.", 400);
    }

    // generate Otp
    const otpNumber = Math.floor(Math.random() * 9999);

    // update otp and save to db
    await Otp.findOneAndUpdate(
      { user_id: user.id },
      { otp: otpNumber, expire_at: new Date(new Date().getTime() + 60 * 5000) },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    // create email
    const mailOptions = {
      from: 'noreplay@galileobox.com',
      to: `${user.email}`,
      subject: 'OTP from GalileoBox',
      text: `Your OTP is: ${otpNumber} This OTP is valid for 5 minutes.`,
    };

    // send email
    transporter.sendMail(mailOptions, error => {
      if (error) {
        return res.status(500).json({ error });
      }
    });

    return response.success(
      res,
      {},
      'OTP was sent to your email. Do not share this OTP with anyone.',
      200,
    );
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Validating User
    const user = await User.findOne({ email });
    if (!user) {
      return response.error(res, {}, "You don't have any user ID.", 400);
    }

    // Validating OTP
    const otpData = await Otp.findOne({ otp, user_id: user.id });
    if (!otpData || otpData.user_id.toString() !== user.id.toString()) {
      return response.error(res, {}, 'Invalid OTP.', 400);
    }
    if (otpData.expire_at < new Date().getTime()) {
      return response.error(res, {}, 'OTP is expired.', 400);
    }

    // Update User
    await User.findOneAndUpdate(
      { email },
      { password: bcrypt.hashSync(password, 10) },
      { new: true },
    );

    // Delete OTP
    await Otp.findOneAndDelete({ otp, user_id: user.id });

    return response.success(res, {}, 'Password updated successfully.', 200);
  } catch (err) {
    return response.error(res, err, 'Error Occurred.', err.status || 500);
  }
};
