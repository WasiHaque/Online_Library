const emailProviders = {
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false
  },
  yahoo: {
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false
  },
  outlook: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false
  }
};

module.exports = emailProviders; 