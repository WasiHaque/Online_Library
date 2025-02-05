const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', auth, roleAuth(['admin', 'librarian']), bookController.createBook);
router.put('/:id', auth, roleAuth(['admin', 'librarian']), bookController.updateBook);
router.delete('/:id', auth, roleAuth(['admin']), bookController.deleteBook);

module.exports = router; 