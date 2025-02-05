const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const Member = require('../models/Member');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, contactNumber, address } = req.body;

      // Check if member already exists
      let member = await Member.findOne({ email });
      if (member) {
        return res.status(400).json({ message: 'Member already exists' });
      }

      // Generate unique membership ID and verification token
      const membershipId = 'MEM' + Date.now().toString().slice(-6);
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new member
      member = new Member({
        name,
        email,
        password: hashedPassword,
        membershipId,
        contactNumber,
        address,
        verified: false,
        verificationToken
      });

      await member.save();

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Library Account',
        html: `
          <h1>Welcome to Our Library!</h1>
          <p>Please click the link below to verify your account:</p>
          <a href="${verificationUrl}">Verify Account</a>
          <p>This link will expire in 24 hours.</p>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ 
        message: 'Registration successful. Please check your email to verify your account.',
        token: verificationToken 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if member exists
      const member = await Member.findOne({ email });
      if (!member) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!member.verified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, member.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create and return JWT token
      const token = jwt.sign(
        { id: member._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find and update member
      const member = await Member.findOne({ email: decoded.email });
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }

      member.verified = true;
      member.verificationToken = undefined;
      await member.save();

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Invalid or expired verification token' });
    }
  }
};

module.exports = authController;