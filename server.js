import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import booksData from './data/books.json';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/WK18MongoCodealong';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model('Book', {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  authors: {
    type: String,
  },
  average_rating: {
    type: Number,
  },
  isbn: {
    unique: true,
    type: String,
  },
  isbn13: {
    type: String,
  },
  language_code: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  ratings_count: {
    type: Number,
  },
  text_reviews_count: {
    type: Number,
  },
});

console.log(`Reset database=${process.env.RESET_DATABASE}?`);
if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');
  const seedDatabase = async () => {
    await Book.deleteMany();
    await booksData.forEach((book) => new Book(book).save());
  };
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get('/books/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const book = await Book.findOne({ isbn: isbn });
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: `Could not find book with isbn=${isbn}` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
