const router = require('express').Router();
const {
  register,
  login,
  verifyByLink,
  verifyByOtp,
  verifyResend,
  forgetPassword,
  resetPassword,
} = require('../../controllers/user/AuthController');

router.post(`/register`, register);

router.post(`/login`, login);

router.get(`/verify`, verifyByLink);

router.post(`/verifyByOtp`, verifyByOtp);

router.post(`/verify/resend`, verifyResend);

router.post(`/forget/password`, forgetPassword);

router.post(`/reset/password`, resetPassword);

module.exports = router;
