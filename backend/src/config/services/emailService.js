const { sendEmail, emailTemplates } = require('../config/emailConfig');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailService = {
  // Send due date reminder
  sendDueReminder: async (member, book, dueDate) => {
    try {
      const template = emailTemplates.dueReminder(
        member.name,
        book.title,
        dueDate.toLocaleDateString()
      );

      await sendEmail(member.email, template.subject, template.text);

      console.log(`Reminder email sent to ${member.email}`);
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  },

  // Send overdue notice
  sendOverdueNotice: async (member, book, dueDate, fine) => {
    try {
      const template = emailTemplates.overdue(
        member.name,
        book.title,
        dueDate.toLocaleDateString(),
        fine.toFixed(2)
      );

      await sendEmail(member.email, template.subject, template.text);

      console.log(`Overdue notice sent to ${member.email}`);
    } catch (error) {
      console.error('Error sending overdue notice:', error);
    }
  },

  // Send welcome email
  sendWelcomeEmail: async (member) => {
    try {
      const template = emailTemplates.welcome(member.name);

      await sendEmail(member.email, template.subject, template.text);

      console.log(`Welcome email sent to ${member.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  },

  // Send verification email
  sendVerificationEmail: async (email, username, verificationCode) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `
          <h1>Welcome to the Library System</h1>
          <p>Hello ${username},</p>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>This code will expire in 1 hour.</p>
          <p>Please enter this code to verify your account.</p>
        `
      });
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
};

module.exports = emailService; 