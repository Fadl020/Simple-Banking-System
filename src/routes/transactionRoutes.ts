import { Router } from 'express';
import { db } from '../config/db';
import { TransactionModel } from '../models/transaction';

const router = Router();
const transactionModel = new TransactionModel(db);

// Route to create a new transaction
router.post('/transactions', async (req, res) => {
  try {
    const transactionId = await transactionModel.create(req.body);
    res.status(201).json({ transactionId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error });
  }
});

// Route to get transactions by account ID
router.get('/transactions/account/:accountId', async (req, res) => {
  try {
    const transactions = await transactionModel.findByAccountId(Number(req.params.accountId));
    if (transactions) {
      res.status(200).json(transactions);
    } else {
      res.status(404).json({ message: 'Transactions not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions', error });
  }
});

export default router;