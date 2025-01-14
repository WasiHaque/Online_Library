const Member = require('../models/Member');

const memberController = {
  // Get all members
  getAllMembers: async (req, res) => {
    try {
      const members = await Member.find();
      res.status(200).json(members);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single member
  getMemberById: async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      res.status(200).json(member);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new member
  createMember: async (req, res) => {
    try {
      // Generate a unique membership ID
      const membershipId = 'MEM' + Date.now().toString().slice(-6);
      const memberData = { ...req.body, membershipId };
      
      const member = new Member(memberData);
      const newMember = await member.save();
      res.status(201).json(newMember);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a member
  updateMember: async (req, res) => {
    try {
      const member = await Member.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      res.status(200).json(member);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a member
  deleteMember: async (req, res) => {
    try {
      const member = await Member.findByIdAndDelete(req.params.id);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = memberController; 