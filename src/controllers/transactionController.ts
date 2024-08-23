import { Request, Response } from "express";
import { db } from "../config/db";

interface CustomRequest extends Request {
  userId: string;
}

export const createTransaction = async (req: CustomRequest, res: Response) => {
  const { accountId, type, amount, description } = req.body;

  try {
    const [account]: any[] = await db.query(
      "SELECT * FROM Accounts WHERE id = ? AND user_id = ?",
      [accountId, req.userId]
    );

    if (account.length === 0) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (type === "debit" && account[0].balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    const newBalance =
      type === "credit"
        ? account[0].balance + amount
        : account[0].balance - amount;

    await db.query(
      "INSERT INTO Transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)",
      [accountId, type, amount, description]
    );
    await db.query("UPDATE Accounts SET balance = ? WHERE id = ?", [
      newBalance,
      accountId,
    ]);

    res.json({ accountId, type, amount, description });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getTransactions = async (req: CustomRequest, res: Response) => {
  const accountId = req.params.id;

  try {
    const [account]: any[] = await db.query(
      "SELECT * FROM Accounts WHERE id = ? AND user_id = ?",
      [accountId, req.userId]
    );

    if (account.length === 0) {
      return res.status(404).json({ msg: "Account not found" });
    }

    const [transactions]: any[] = await db.query(
      "SELECT * FROM Transactions WHERE account_id = ?",
      [accountId]
    );

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getTransaction = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  try {
    const [transaction]: any[] = await db.query(
      "SELECT * FROM Transactions WHERE id = ?",
      [id]
    );

    if (transaction.length === 0) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    res.json(transaction[0]);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const deposit = async (req: CustomRequest, res: Response) => {
  const accountId = req.params.id;
  const { amount } = req.body;

  try {
    const [account]: any[] = await db.query(
      "SELECT * FROM Accounts WHERE id = ? AND user_id = ?",
      [accountId, req.userId]
    );
    if (account === undefined) {
      return res.status(404).json({ msg: "Account not found" });
    }

    await db.query("UPDATE Accounts SET balance = balance + ? WHERE id = ?", [
      amount,
      accountId,
    ]);
    res.json({ msg: "Deposit successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const withdraw = async (req: CustomRequest, res: Response) => {
  const accountId = req.params.id;
  const { amount } = req.body;

  try {
    const [account]: any[] = await db.query(
      "SELECT * FROM Accounts WHERE id = ? AND user_id = ?",
      [accountId, req.userId]
    );
    if (account === undefined) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    await db.query("UPDATE Accounts SET balance = balance - ? WHERE id = ?", [
      amount,
      accountId,
    ]);
    res.json({ msg: "Withdrawal successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const transferMoney = async (req: CustomRequest, res: Response) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;

  try {
    const [fromAccount]: any[] = await db.query(
      "SELECT * FROM Accounts WHERE id = ? AND user_id = ?",
      [fromAccountId, req.userId]
    );
    const [toAccount]: any[] = await db.query(
      "SELECT * FROM Accounts WHERE id = ?",
      [toAccountId]
    );

    if (fromAccount.length === 0 || toAccount.length === 0) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (fromAccount[0].balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    const fromNewBalance = fromAccount[0].balance - amount;
    const toNewBalance = toAccount[0].balance + amount;

    await db.query("UPDATE Accounts SET balance = ? WHERE id = ?", [
      fromNewBalance,
      fromAccountId,
    ]);
    await db.query("UPDATE Accounts SET balance = ? WHERE id = ?", [
      toNewBalance,
      toAccountId,
    ]);

    await db.query(
      "INSERT INTO Transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)",
      [
        fromAccountId,
        "debit",
        amount,
        `Transfer to ${toAccountId}: ${description}`,
      ]
    );
    await db.query(
      "INSERT INTO Transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)",
      [
        toAccountId,
        "credit",
        amount,
        `Transfer from ${fromAccountId}: ${description}`,
      ]
    );

    res.json({ msg: "Transfer successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
