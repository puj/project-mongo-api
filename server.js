import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import {
  createDogData,
  createOwnerData,
  generateDogs,
  generateOwners,
  connectSomeDogsToOwners,
} from './examples/generateData.js';
const Schema = mongoose.Schema;

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/W18DogOwnerExample';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Dog = mongoose.model('Dog', {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  breed: {
    type: String,
  },
  owner: { type: Schema.Types.ObjectId, ref: 'Owner' },
});

const Owner = mongoose.model('Owner', {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  occupation: {
    type: String,
  },
});

if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');

  const seedDatabase = async () => {
    // Clear our database
    await Owner.deleteMany();
    await Dog.deleteMany();

    const generatedOwners = generateOwners(6);
    console.log(`Generated ${generatedOwners.length} owners`);
    generatedOwners.forEach(async (owner) => await new Owner(owner).save());

    const generatedDogs = generateDogs(generatedOwners, 10);
    console.log(`Generated ${generatedDogs.length} dogs`);
    generatedDogs.forEach(async (dog) => await new Dog(dog).save());
  };
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ----- Create a utility function -----

// Typical front-end/backend text transform function
//  INPUT: owned: string containing "true" or "false"
//  OUTPUT: "owned", "unowned" or ""
const getTextFromIsOwned = (owned) => {
  if (owned == 'true') {
    return 'owned';
  } else if (owned == 'false') {
    return 'unowned';
  }
  return '';
};
//  A confusing line of code if getTextFromIsOwned did not exist
//  console.log(
//     `Found ${owned ? (owned == "true" ? "owned" : "unowned") : ""} ${
//       dogs.length
//     } dogs..`
//   );
// ------------------------------------

app.get('/dogs', async (req, res) => {
  const { owned } = req.query;

  // ----- Create a Search Filter -----

  // Initialize the search filter as a filter which captures all results
  //   Used later: Dog.find(searchFilter) == Dog.find({})
  //   Since Dog.find({}) finds all dogs
  //   The Default value of searchFilter will return all dogs
  let searchFilter = {};

  if (owned === 'false') {
    // Here we modify the filter to look like
    //    searchFilter == {owner === null}
    //    Now Dog.find({ owner: { $eq: null } ) will be executed instead
    //    Mongo will find dogs where the value of owner is null
    searchFilter = { owner: { $eq: null } };
  }

  if (owned === 'true') {
    // Here we modify the filter to look like
    //    searchFilter == {owner !== null}
    //    Now Dog.find({ owner: { $ne: null } ) will be executed instead
    //    Mongo will find dogs where the dog has an owner
    searchFilter = { owner: { $ne: null } };
  }
  // ------------------------------------

  // searchFilter should either:
  //   1. The find returns all dogs
  //   2. The find returns dogs without owners
  const dogs = await Dog.find(searchFilter).populate('owner');

  console.log(`Found ${getTextFromIsOwned(owned)} ${dogs.length} dogs..`);

  res.json(dogs);
});
app.get('/owners', async (req, res) => {
  const owners = await Owner.find();
  console.log(`Found ${owners.length} owners..`);
  res.json(owners);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
