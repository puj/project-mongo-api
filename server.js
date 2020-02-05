import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: {
    type: Number
  },
  title: {
    type: String
  },
  authors: {
    type: String
  },
  average_rating: {
    type: Number
  },
  isbn: {
    unique: true,
    type: String
  },
  isbn13: {
    type: String
  },
  language_code: {
    type: String
  },
  num_pages: {
    type: Number
  },
  ratings_count: {
    type: Number
  },
  text_reviews_count: {
    type: Number
  }
});

const addBooksToDatabase = () => {
  booksData.forEach((book) => {
    new Book(book).save();
  });
};
// addBooksToDatabase();

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.get('/books', (req, res) => {
  const queryString = req.query.q;
  const queryRegex = new RegExp(queryString, "i");
  Book.find({'title': queryRegex})
    .sort({'num_pages': -1})
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results);
      res.json(results);
    }).catch((err) => {
      // Error/Failure
      console.log('Error ' + err);
      res.json({message: 'Cannot find this book', err: err});
    });
});

app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  Book.findOne({'isbn': isbn})
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      res.json({message: 'Cannot find this book', err: err});
    });
});

app.get('/books/__v/:__v', (req, res) => {
  const __v = req.params.__v;
  Book.find({'__v': __v})
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      res.json({message: 'Cannot find this book', err: err});
    });
});

app.get('/books/_id/:_id', (req, res) => {
  const _id = req.params._id;
  Book.findOne({'_id': _id})
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      res.json({message: 'Cannot find this book', err: err});
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
