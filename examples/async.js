import mongoose from 'mongoose';
import Book from './book.js';
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/WK18MongoCodealong';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const runExample = async () => {
  // Example 1
  const books = await Book.find();
  console.log(`Found ${books.length} using async/await`);

  // Example 2
  Book.find().then((books) => {
    console.log(`Found ${books.length} using promises`);
  });
};
runExample();
console.log('<End of Code>');
