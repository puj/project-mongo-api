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
    type: String
  },
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

// booksData.forEach((book) => {
//   new Book(book).save();
// });

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

Book.find({'title': /Harry/i})
  .then((results) => {
    console.log('Found : ' + results);
  }).catch((err) => {
    console.log('Error ' + err);
  });



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
