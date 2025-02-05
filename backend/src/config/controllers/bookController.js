const Book = require('../models/Book');

// Controller methods
const bookController = {
  // Get all books
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single book by ID
  getBookById: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new book
  createBook: async (req, res) => {
    try {
      const book = new Book(req.body);
      const newBook = await book.save();
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a book
  updateBook: async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a book
  deleteBook: async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookController; 