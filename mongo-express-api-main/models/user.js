import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  favoriteColor: {
    type: String,
    required: true,
    default: "blue"
  },
});

export default mongoose.model('User', usersSchema)