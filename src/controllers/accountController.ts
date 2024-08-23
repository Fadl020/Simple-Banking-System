import { Request, Response } from "express";
import { db } from "../config/db";

interface CustomRequest extends Request {
  userId: string;
}



export const createAccount = async (req: CustomRequest, res: Response) => {
  const { accountType } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO Accounts (user_id, account_type) VALUES (?, ?)",
      [req.userId, accountType]
    );
    const accountId = (result as any).insertId;

    res.json({ id: accountId, userId: req.userId, balance: 0, accountType });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAccount = async (req: CustomRequest, res: Response) => {
  const accountId = req.params.id;

  try {
    const [account]: any[] = await db.query(
      "SELECT * FROM Accounts WHERE id = ? AND user_id = ?",
      [accountId, req.userId]
    );
    if (account === undefined) {
      return res.status(404).json({ msg: "Account not found" });
    }

    res.json(account);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};