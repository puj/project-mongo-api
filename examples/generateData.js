import mongoose from 'mongoose';
const firstNames = ['Jon', 'Ian', 'Ivan', 'Gunnar', 'Kim'];
const surnames = [
  'Aftername',
  'Bäckfjäll',
  'Mountainstream',
  'Park',
  'Raspjeksi',
];

const doggoNames = ['Doggo', 'Ralph', 'Fido', 'Roffe', 'Blix', 'Nugget'];

const createAge = () => {
  return parseInt(Math.random() * 15);
};

const createName = () => {
  const surname = surnames[parseInt(surnames.length * Math.random())];
  const firstName = firstNames[parseInt(firstNames.length * Math.random())];
  return `${firstName} ${surname}`;
};

const createDogName = () => {
  return doggoNames[parseInt(doggoNames.length * Math.random())];
};

export const createOwnerData = () => {
  // Everyone is a student in this life
  const occupation = 'Student';
  return {
    _id: new mongoose.Types.ObjectId(),
    name: createName(),
    age: createAge() * 7,
  };
};

export const createDogData = (owners) => {
  const breed = 'Terrier';
  return {
    name: createDogName(),
    age: createAge(),
    breed,
    owner: getRandomDogOwner(owners),
  };
};

export const generateDogs = (owners, num) => {
  return Array.from(Array(num), () => createDogData(owners));
};

export const generateOwners = (num) => {
  return Array.from(Array(num), () => createOwnerData());
};

const getRandomDogOwner = (owners) => {
  if (Math.random() < 0.5) {
    return;
  }

  return getRandomElementFromArray(owners);
};

const getRandomElementFromArray = (arr) => {
  return arr[parseInt(Math.random() * arr.length)];
};

export const connectSomeDogsToOwners = async (dogs, owners) => {
  await dogs.forEach(async (dog) => {
    dog.owner = getRandomDogOwner(owners);
    await dog.save();
  });
};
