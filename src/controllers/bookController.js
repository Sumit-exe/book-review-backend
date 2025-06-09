const Book = require('../models/Book');
const Review = require('../models/Review');

exports.createBook = async (req, res, next) => {
  try {
    const { title, author, genre } = req.body;
    const imageUrl = req.file?.location; 
    const book = await Book.create({
      title,
      author,
      genre,
      imageUrl,
      createdBy: req.user._id
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.getAllBooks = async (req, res, next) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = new RegExp(genre, 'i');

  try {
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(books);
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ bookId: book._id });
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / (reviews.length || 1);

    res.json({ book, averageRating, reviews });
  } catch (err) {
    next(err);
  }
};

exports.searchBooks = async (req, res, next) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Search query is required' });

  try {
    const books = await Book.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') }
      ]
    });
    res.json(books);
  } catch (err) {
    next(err);
  }
};


// Update Book
exports.updateBook = async (req, res, next) => {
  try {
    const { title, author, genre } = req.body;
    const imageUrl = req.file?.location;

    const updateData = { title, author, genre };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (err) {
    next(err);
  }
};


// Delete Book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if the logged-in user is the creator of the book
    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this book' });
    }

    await Review.deleteMany({ bookId: book._id }); // Optional: delete all related reviews
    await book.deleteOne();

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
};
