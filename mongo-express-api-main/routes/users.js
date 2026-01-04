import express from 'express';
const router = express.Router();
import User from '../models/user.js';

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a user
router.post('/', async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    favoriteColor: req.body.favoriteColor,
  })

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get one user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user)
})

// Update a user
router.patch('/:id', getUser, async (req, res) => {
  // Get the req.body parameters
  const { firstName, lastName, age, favoriteColor } = req.body;

  if (firstName) res.user.firstName = firstName;
  if (lastName) res.user.lastName = lastName;
  if (age) res.user.age = age;
  if (favoriteColor) res.user.favoriteColor = favoriteColor;

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

// Delete a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      // Could not find user
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    // Error on server side
    return res.status(500).json({ message: err.message })
  }
  // res.user can now be used in our other router handlers
  res.user = user;

  // Moves onto next piece of middleware or request
  next();
}

// Export router to use in index.js
export default router;