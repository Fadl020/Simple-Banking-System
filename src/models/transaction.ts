// src/models/Transaction.ts
import mysql from 'mysql2/promise';

export interface Transaction {
  id?: number;
  account_id: number;
  type: 'debit' | 'credit';
  amount: number;
  timestamp?: Date;
  description?: string;
}

export class TransactionModel {
  private db: mysql.Connection;

  constructor(db: mysql.Connection) {
    this.db = db;
  }

  async create(transaction: Transaction): Promise<number> {
    const [result] = await this.db.query<mysql.OkPacket>(
      'INSERT INTO Transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [transaction.account_id, transaction.type, transaction.amount, transaction.description]
    );
    return result.insertId;
  }

  async findByAccountId(account_id: number): Promise<Transaction[] | null> {
    const [rows] = await this.db.query<mysql.RowDataPacket[]>(
      'SELECT * FROM Transactions WHERE account_id = ?',
      [account_id]
    );
    return rows.length > 0 ? (rows as Transaction[]) : null;
  }
}
