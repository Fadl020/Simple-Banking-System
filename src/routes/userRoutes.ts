// src/routes/userRoutes.ts
import { Router } from 'express';
import { db } from '../config/db';
import { UserModel } from '../models/user';

const router = Router();
const userModel = new UserModel(db);

// Route to create a new user
router.post('/users', async (req, res) => {
  try {
    const userId = await userModel.create(req.body);
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Route to get a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await userModel.findById(Number(req.params.id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
});

export default router;