const router = require('express').Router();
const { login, register } = require('../../controllers/admin/AuthController');
const { validate } = require('../../validation');
const { loginSchema } = require('../../validation/admin/loginSchema');

router.post(`/login`, validate(loginSchema), login);

router.get(`/register`, register);

module.exports = router;
