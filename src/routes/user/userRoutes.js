const router = require('express').Router();
const {
  verifyOTP,
  verifyPassword,
  profileUpdate,
  emailUpdate,
  changePassword,
} = require('../../controllers/user/UserController');

// Verify OTP
router.post(`/verify/otp`, verifyOTP);

// Verify Password
router.post(`/verify/password`, verifyPassword);

// User Profile Update
router.put(`/profile/update`, profileUpdate);

// User Email Update
router.patch(`/email/update`, emailUpdate);

// User Change Password
router.patch(`/change-password/`, changePassword);

module.exports = router;
