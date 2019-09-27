import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import template from './templates';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailer = (to, subject, content) => {
  const message = {
    from: process.env.EMAIL,
    to,
    html: content,
    subject,
  };
  if (process.env.NODE_ENV !== 'test') {
    return sgMail.send(message);
  }
};

/**
 * @function sendResetMail
 * @description Sends password reset mail
 * @param {Object} user User object
 * @param {String} token Token
 */
const sendResetMail = (user, token) => {
  const { email } = user;
  const subject = 'Password Recovery';
  const content = template.passwordRecovery(user, token);
  mailer(email, subject, content);
};

/**
 * @function sendLoanNotificationMail
 * @description Sends approval/rejection notification mail
 * @param {Object} user User object
 * @param {String} status Loan status
 */
const sendLoanNotificationMail = (user, status) => {
  const { email } = user;
  const subject = 'Loan Notification';
  const content = template.notification(user, status);
  mailer(email, subject, content);
};

const sendWelcomeMail = (user) => {
  const { email } = user;
  const subject = 'Welcome to Quick-Credit';
  const content = template.welcome(user);
  mailer(email, subject, content);
};

export default { sendResetMail, sendLoanNotificationMail, sendWelcomeMail };
