import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// Get a single user by ID or username
export const getSingleUser = async (req: Request, res: Response) => {
  const foundUser = await User.findOne({
    $or: [
      { _id: req.user ? req.user._id : req.params.id },
      { username: req.params.username }
    ],
  });

  if (!foundUser) {
    return res.status(400).json({ message: 'Cannot find a user with this id!' });
  }

  return res.json(foundUser);
};

// Create a user, sign a token, and send it back
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({ message: 'Something is wrong!' });
    }

    const token = signToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login a user, sign a token, and send it back
export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  });

  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  const correctPw = await user.isCorrectPassword(req.body.password);

  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' });
  }

  const token = signToken({
    _id: user._id,
    username: user.username,
    email: user.email,
  });

  return res.json({ token, user });
};

// Save a book to user's savedBooks
export const saveBook = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { savedBooks: req.body } },
      { new: true, runValidators: true }
    );
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

// Remove a book from savedBooks
export const deleteBook = async (req: Request, res: Response) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { savedBooks: { bookId: req.params.bookId } } },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "Couldn't find user with this id!" });
  }

  return res.json(updatedUser);
};
