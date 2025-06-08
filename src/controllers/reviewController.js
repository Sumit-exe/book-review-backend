const Review = require('../models/Review');

exports.createReview = async (req, res, next) => {
  const { rating, comment } = req.body;
  const bookId = req.params.id;
  try {
    const review = await Review.create({
      bookId,
      userId: req.user._id,
      rating,
      comment,
      createdBy: req.user.username
    });
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'You have already reviewed this book.' });
    } else {
      next(err);
    }
  }
};

exports.updateReview = async (req, res, next) => {

  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};