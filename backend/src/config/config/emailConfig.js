const nodemailer = require('nodemailer');
const emailProviders = require('./emailProviders');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-actual-gmail@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-16-digit-app-password'
  }
});

const createTransporter = async (user) => {
  const provider = emailProviders[user.emailProvider] || emailProviders.gmail;
  
  return nodemailer.createTransport({
    host: provider.host,
    port: provider.port,
    secure: provider.secure,
    auth: {
      user: user.email,
      pass: user.emailPassword // This would be their app password
    }
  });
};

const sendEmail = async (from, to, subject, text) => {
  try {
    const transporter = await createTransporter(from);
    await transporter.sendMail({
      from: from.email,
      to,
      subject,
      text
    });
    console.log(`Email sent from ${from.email} to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  dueReminder: (memberName, bookTitle, dueDate) => ({
    subject: 'Book Due Reminder',
    text: `Dear ${memberName},\n\nThis is a reminder that "${bookTitle}" is due on ${dueDate}.\n\nBest regards,\nLibrary Team`
  }),
  
  overdue: (memberName, bookTitle, dueDate, fine) => ({
    subject: 'Book Overdue Notice',
    text: `Dear ${memberName},\n\nThe book "${bookTitle}" was due on ${dueDate}. Current fine: $${fine}.\n\nPlease return the book as soon as possible.\n\nBest regards,\nLibrary Team`
  }),
  
  welcome: (memberName) => ({
    subject: 'Welcome to the Library',
    text: `Dear ${memberName},\n\nWelcome to our library system! We're excited to have you as a member.\n\nBest regards,\nLibrary Team`
  })
};

module.exports = { transporter, emailTemplates }; 