const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const Member = require('../models/Member');

const borrowingController = {
  // Get all borrowings
  getAllBorrowings: async (req, res) => {
    try {
      const borrowings = await Borrowing.find()
        .populate('bookId')
        .populate('memberId');
      res.status(200).json(borrowings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new borrowing (checkout book)
  checkoutBook: async (req, res) => {
    try {
      const { bookId, memberId, dueDate } = req.body;

      // Check if book exists and is available
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      if (book.availableCopies < 1) {
        return res.status(400).json({ message: 'Book is not available' });
      }

      // Check if member exists and is active
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      if (member.status !== 'active') {
        return res.status(400).json({ message: 'Member account is not active' });
      }

      // Create borrowing record
      const borrowing = new Borrowing({
        bookId,
        memberId,
        dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      });

      // Update book availability
      book.availableCopies -= 1;
      await book.save();

      const newBorrowing = await borrowing.save();
      res.status(201).json(newBorrowing);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Return book
  returnBook: async (req, res) => {
    try {
      const { borrowingId } = req.params;
      
      const borrowing = await Borrowing.findById(borrowingId);
      if (!borrowing) {
        return res.status(404).json({ message: 'Borrowing record not found' });
      }
      if (borrowing.status === 'returned') {
        return res.status(400).json({ message: 'Book already returned' });
      }

      // Update book availability
      const book = await Book.findById(borrowing.bookId);
      book.availableCopies += 1;
      await book.save();

      // Update borrowing record
      borrowing.returnDate = new Date();
      borrowing.status = 'returned';
      
      // Calculate fine if overdue
      if (new Date() > borrowing.dueDate) {
        const daysLate = Math.ceil(
          (new Date() - borrowing.dueDate) / (1000 * 60 * 60 * 24)
        );
        borrowing.fineAmount = daysLate * 0.50; // $0.50 per day
      }

      await borrowing.save();
      res.status(200).json(borrowing);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get borrowing by ID
  getBorrowingById: async (req, res) => {
    try {
      const borrowing = await Borrowing.findById(req.params.id)
        .populate('bookId')
        .populate('memberId');
      if (!borrowing) {
        return res.status(404).json({ message: 'Borrowing record not found' });
      }
      res.status(200).json(borrowing);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = borrowingController; 