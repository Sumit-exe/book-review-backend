const express = require('express');
const { createBook, getAllBooks, getBookById, searchBooks,updateBook, deleteBook } = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // ✅

const router = express.Router();

router.post('/', protect, upload.single('image'), createBook); // ✅ image upload
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

// Update Book
router.put('/:id', protect, upload.single('image'), updateBook);
// Delete Book
router.delete('/:id', protect, deleteBook);

module.exports = router;
