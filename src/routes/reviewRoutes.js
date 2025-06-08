const express = require('express');
const { createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:id/reviews', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
