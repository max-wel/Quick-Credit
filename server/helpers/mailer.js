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
const sendResetMail = (user, token) => {
  const mailOptions = {
    from: 'notification@quick-credit',
    to: user.email,
    subject: 'Password Recovery',
    html: template.passwordRecovery(user, token),
  };
  transporter.sendMail(mailOptions, (err, info) => console.log(err, info));
};
export default { sendResetMail };
