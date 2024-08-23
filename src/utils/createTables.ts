import { db } from '../config/db';

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS Accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        balance DECIMAL(15, 2) DEFAULT 0,
        account_type VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS Transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT,
        type ENUM('debit', 'credit'),
        amount DECIMAL(15, 2) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        description VARCHAR(255),
        FOREIGN KEY (account_id) REFERENCES Accounts(id)
      );
    `);

    console.log('All tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    db.end(); // Close the database connection pool
  }
};

createTables();