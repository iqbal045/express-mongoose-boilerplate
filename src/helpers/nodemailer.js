const config = require('config');
const nodemailer = require('nodemailer');

const gmailUser = config.get('GMAIL_ID');
const gmailPassword = config.get('GMAIL_PASSWORD');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPassword,
  },
});

module.exports = transporter;
