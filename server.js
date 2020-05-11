import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import booksData from './data/books.json';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/WK18LiveCodealongPart1';
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

if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');

  const seedDatabase = async () => {
    // Clear our database
    await Book.deleteMany();
    // Save all of the books from books.json to the database
    await booksData.forEach((book) => new Book(book).save());
  };
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/books', async (req, res) => {
  const books = await Book.find();
  console.log(`Found ${books.length} books..`);
  res.json(books);
});

app.get('/books/:isbn', async (req, res) => {
  const { isbn } = req.params;
  const book = await Book.findOne({ isbn: isbn });
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: `Could not find book with isbn=${isbn}` });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
