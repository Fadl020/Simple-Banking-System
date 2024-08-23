# Banking System API

This project is a simple banking system API built with Node.js, TypeScript, Express, and MySQL. It includes features for user authentication, managing accounts, and performing transactions.

## Project Structure


## Features

- User Registration and Login with JWT Authentication
- Create, View, and Manage Bank Accounts
- Perform Transactions (Debit, Credit, and Transfers)
- Secure API with Authentication Middleware

## Setup Instructions
1. Clone the Repository
First, clone the repository from GitHub to your local machine:
git clone https://github.com/Fadl020/Simple-Banking-System.git
cd your-repository-name

2. Install Dependencies
Install the required Node.js packages using npm:
npm install

3. Set Up the MySQL Database
3.1. Install MySQL
* If you don't have MySQL installed, download and install it from MySQL's official website(https://www.mysql.com/).
* Follow the installation instructions based on your operating system.
3.2. Create the Database
* Log in to your MySQL server using the command line:
mysql -u root -p
* Create the database:
sql
CREATE DATABASE banking_system;
* Exit the MySQL CLI:
EXIT;

4. Configure Environment Variables
Create a .env file in the root directory of your project and add the following configuration:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=banking_system
JWT_SECRET=your_jwt_secret
Replace yourpassword with your MySQL root password, and your_jwt_secret with a secure, random string that will be used to sign JWT tokens.

5. Run Database Migrations
To create the necessary tables, run the migration script:
npm run migrate
This will create the Users, Accounts, and Transactions tables in your MySQL database.

6. Run the Application
You can run the application in development mode using Nodemon:
npm run dev
This command starts the server and watches for changes, automatically restarting when files are modified.
Alternatively, you can compile the TypeScript code and run the compiled JavaScript files:
npm run build
npm start

7. Test the API
You can test the API using a tool like Postman or cURL. Below are some example endpoints:
* Register a new user: POST /auth/register
* Login a user: POST /auth/login
* Create a new account: POST /accounts
* Get account details: GET /accounts/:id
* Create a transaction: POST /transactions
* Get transactions: GET /transactions

8. (Optional) Set Up a Git Repository
If you haven’t already initialized a git repository, you can do so with:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Fadl020/Simple-Banking-System.git
git push -u origin master