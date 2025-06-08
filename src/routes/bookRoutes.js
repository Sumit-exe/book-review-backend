const express = require('express');
const { createBook, getAllBooks, getBookById, searchBooks } = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // ✅

const router = express.Router();

router.post('/', protect, upload.single('image'), createBook); // ✅ image upload
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

module.exports = router;
