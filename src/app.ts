import express from 'express';
import dotenv from 'dotenv';
import { db } from './config/db';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', accountRoutes);
app.use('/api', transactionRoutes);

// Test Database Connection
const testDBConnection = async () => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('Database Connected: Test Query Result -', rows);
  } catch (error) {
    console.error('Database Connection Failed:', error);
    process.exit(1); // Exit the process with failure
  }
};

testDBConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});