import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../config/db';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const [user]: any[] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (user !== undefined) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    const payload = { userId: (result[0] as any)?.insertId || (result[0] as any)?.insertId };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const [user]: any[] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
      if ((user as any[]).length === 0) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const payload = { userId: (user[0] as any)?.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };

  export const getMe = async (req: Request & { userId: number }, res: Response) => {
    try {
      const [user]: any[] = await db.query('SELECT id, name, email FROM Users WHERE id = ?', [req.userId]);
      res.json(user[0]);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };