import mysql from 'mysql2/promise';

export interface Account {
  id?: number;
  user_id: number;
  balance: number;
  account_type: string;
}

export class AccountModel {
  private db: mysql.Connection;

  constructor(db: mysql.Connection) {
    this.db = db;
  }

  async create(account: Account): Promise<number> {
    const [result] = await this.db.query<mysql.OkPacket>(
      'INSERT INTO Accounts (user_id, balance, account_type) VALUES (?, ?, ?)',
      [account.user_id, account.balance, account.account_type]
    );
    return result.insertId;
  }

  async findById(id: number): Promise<Account | null> {
    const [rows] = await this.db.query<mysql.RowDataPacket[]>(
      'SELECT * FROM Accounts WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Account) : null;
  }

  async findByUserId(user_id: number): Promise<Account[] | null> {
    const [rows] = await this.db.query<mysql.RowDataPacket[]>(
      'SELECT * FROM Accounts WHERE user_id = ?',
      [user_id]
    );
    return rows.length > 0 ? (rows as Account[]) : null;
  }
}
