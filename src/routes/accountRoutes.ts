import { Router } from 'express';
import { db } from '../config/db';
import { AccountModel } from '../models/account';

const router = Router();
const accountModel = new AccountModel(db);

// Route to create a new account
router.post('/accounts', async (req, res) => {
  try {
    const accountId = await accountModel.create(req.body);
    res.status(201).json({ accountId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account', error });
  }
});

// Route to get accounts by user ID
router.get('/accounts/user/:userId', async (req, res) => {
  try {
    const accounts = await accountModel.findByUserId(Number(req.params.userId));
    if (accounts) {
      res.status(200).json(accounts);
    } else {
      res.status(404).json({ message: 'Accounts not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving accounts', error });
  }
});

export default router;