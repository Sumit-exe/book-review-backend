// 📁 backend/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({
  origin: "*", 
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books', reviewRoutes);

// app.use(errorHandler);
module.exports = app;
