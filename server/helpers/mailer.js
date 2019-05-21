import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import template from './templates';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

/**
 * @function sendResetMail
 * @description Sends password reset mail
 * @param {Object} user User object
 * @param {String} token Token
 */
const sendResetMail = (user, token) => {
  const mailOptions = {
    from: 'notification@quick-credit',
    to: user.email,
    subject: 'Password Recovery',
    html: template.passwordRecovery(user, token),
  };
  transporter.sendMail(mailOptions, (err, info) => console.log(err, info));
};

/**
 * @function sendLoanNotificationMail
 * @description Sends approval/rejection notification mail
 * @param {Object} user User object
 * @param {String} status Loan status
 */
const sendLoanNotificationMail = (user, status) => {
  const mailOptions = {
    from: 'notification@quick-credit',
    to: user.email,
    subject: 'Loan Notification',
    html: template.notification(user, status),
  };
  transporter.sendMail(mailOptions, (err, info) => console.log(err, info));
};

const sendWelcomeMail = (user) => {
  const mailOptions = {
    from: 'notification@quick-credit',
    to: user.email,
    subject: 'Welcome to Quick-Credit',
    html: template.welcome(user),
  };
  transporter.sendMail(mailOptions, (err, info) => console.log(err, info));
};

export default { sendResetMail, sendLoanNotificationMail, sendWelcomeMail };
