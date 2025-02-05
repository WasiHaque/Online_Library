const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');

// Define routes
router.get('/', borrowingController.getAllBorrowings);
router.get('/:id', borrowingController.getBorrowingById);
router.post('/checkout', borrowingController.checkoutBook);
router.put('/return/:borrowingId', borrowingController.returnBook);

module.exports = router; 