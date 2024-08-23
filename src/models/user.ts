import mysql from 'mysql2/promise';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export class UserModel {
  private db: mysql.Connection;

  constructor(db: mysql.Connection) {
    this.db = db;
  }

  async create(user: User): Promise<number> {
    const [result] = await this.db.query<mysql.OkPacket>(
      'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
      [user.name, user.email, user.password]
    );
    return result.insertId;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await this.db.query<mysql.RowDataPacket[]>(
      'SELECT * FROM Users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.db.query<mysql.RowDataPacket[]>(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }
}
