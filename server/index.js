import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database
const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create income table if not exists
await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255), -- Add this line
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

    
// Create expense table if not exists
await connection.query(`
  CREATE TABLE IF NOT EXISTS expense (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);


    
    console.log('Database initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const connection = await pool.getConnection();
    
    // Check if email already exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    connection.release();
    
    // Create and assign token
    const user = { id: result.insertId, username, email };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const connection = await pool.getConnection();
    
    // Find user
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      connection.release();
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    connection.release();
    
    // Create and assign token
    const userData = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(userData, process.env.JWT_SECRET);

    
    res.status(200).json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/me', authenticateToken, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, email: req.user.email });
});

// Income routes
app.get('/api/incomes', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [incomes] = await connection.query(
      'SELECT * FROM income WHERE user_id = ? ORDER BY date DESC',
      [req.user.id]
    );
    
    connection.release();
    res.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/incomes', authenticateToken, async (req, res) => {
  try {
    const { amount, date, note } = req.body;
    
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      'INSERT INTO income (user_id, amount, date, note) VALUES (?, ?, ?, ?)',
      [req.user.id, amount, date, note]
    );
    
    connection.release();
    
    res.status(201).json({ id: result.insertId, amount, date, note });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/incomes/:id', authenticateToken, async (req, res) => {
  try {
    const { amount, date, note } = req.body;
    const incomeId = req.params.id;
    
    const connection = await pool.getConnection();
    
    // Check if income belongs to user
    const [incomes] = await connection.query(
      'SELECT * FROM income WHERE id = ? AND user_id = ?',
      [incomeId, req.user.id]
    );
    
    if (incomes.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Income not found' });
    }
    
    await connection.query(
      'UPDATE income SET amount = ?, date = ?, note = ? WHERE id = ?',
      [amount, date, note, incomeId]
    );
    
    connection.release();
    
    res.json({ id: incomeId, amount, date, note });
  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/incomes/:id', authenticateToken, async (req, res) => {
  try {
    const incomeId = req.params.id;
    
    const connection = await pool.getConnection();
    
    // Check if income belongs to user
    const [incomes] = await connection.query(
      'SELECT * FROM income WHERE id = ? AND user_id = ?',
      [incomeId, req.user.id]
    );
    
    if (incomes.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Income not found' });
    }
    
    await connection.query('DELETE FROM income WHERE id = ?', [incomeId]);
    
    connection.release();
    
    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Expense routes
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [expenses] = await connection.query(
      'SELECT * FROM expense WHERE user_id = ? ORDER BY date DESC',
      [req.user.id]
    );
    
    connection.release();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { amount, category, subcategory, date, note } = req.body;

    // Get the database connection
    const connection = await pool.getConnection();

    // Query to insert the expense into the database
    const [result] = await connection.query(
      'INSERT INTO expense (user_id, amount, category, subcategory, date, note) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, amount, category, subcategory !== '' ? subcategory : null, date, note] // UPDATED line
    );

    connection.release(); // Release the connection

    // Respond with the inserted data (including the ID from the result)
    res.status(201).json({
      id: result.insertId,
      amount,
      category,
      subcategory,
      date,
      note
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const { amount, category, subcategory, date, note } = req.body;
    const expenseId = req.params.id; // Get the expense ID from the URL

    const connection = await pool.getConnection();

    // Check if the expense belongs to the authenticated user
    const [expenses] = await connection.query(
      'SELECT * FROM expense WHERE id = ? AND user_id = ?',
      [expenseId, req.user.id]
    );

    if (expenses.length === 0) {
      connection.release(); // Release the connection
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Query to update the expense in the database
    await connection.query(
      'UPDATE expense SET amount = ?, category = ?, subcategory = ?, date = ?, note = ? WHERE id = ?',
      [amount, category, subcategory !== '' ? subcategory : null, date, note, expenseId] // UPDATED line
    );

    connection.release(); // Release the connection

    // Respond with the updated data
    res.json({
      id: expenseId,
      amount,
      category,
      subcategory,
      date,
      note
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expenseId = req.params.id;
    
    const connection = await pool.getConnection();
    
    // Check if expense belongs to user
    const [expenses] = await connection.query(
      'SELECT * FROM expense WHERE id = ? AND user_id = ?',
      [expenseId, req.user.id]
    );
    
    if (expenses.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await connection.query('DELETE FROM expense WHERE id = ?', [expenseId]);
    
    connection.release();
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard summary route
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Get total income
    const [totalIncomeResult] = await connection.query(
      'SELECT SUM(amount) as total FROM income WHERE user_id = ?',
      [req.user.id]
    );
    const totalIncome = totalIncomeResult[0].total || 0;

    // Get total expense
    const [totalExpenseResult] = await connection.query(
      'SELECT SUM(amount) as total FROM expense WHERE user_id = ?',
      [req.user.id]
    );
    const totalExpense = totalExpenseResult[0].total || 0;

    // Calculate balance
    const balance = totalIncome - totalExpense;

    // Get current month incomes
    const [recentIncomes] = await connection.query(
      `SELECT * FROM income WHERE user_id = ? AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) ORDER BY date DESC`,
      [req.user.id]
    );

    // Get current month expenses
    const [recentExpenses] = await connection.query(
      `SELECT * FROM expense WHERE user_id = ? AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) ORDER BY date DESC`,
      [req.user.id]
    );

    // Get expense totals by category
    const [categoryTotals] = await connection.query(
      'SELECT category, SUM(amount) as amount FROM expense WHERE user_id = ? GROUP BY category ORDER BY amount DESC',
      [req.user.id]
    );

    connection.release();

    // ✅ Single, complete JSON response
    res.json({
      totalIncome,
      totalExpense,
      balance,
      recentIncomes,
      recentExpenses,
      categoryTotals,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Monthly income and expense summary route
app.get('/api/finance/monthly-summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [incomeRows] = await pool.query(`
      SELECT MONTH(date) AS month, SUM(amount) AS total
      FROM income
      WHERE user_id = ?
      GROUP BY MONTH(date)
    `, [userId]);

    const [expenseRows] = await pool.query(`
      SELECT MONTH(date) AS month, SUM(amount) AS total
      FROM expense
      WHERE user_id = ?
      GROUP BY MONTH(date)
    `, [userId]);

    const income = Array(12).fill(0);
    const expenses = Array(12).fill(0);

    incomeRows.forEach(row => {
      income[row.month - 1] = row.total;
    });

    expenseRows.forEach(row => {
      expenses[row.month - 1] = row.total;
    });

    res.json({ income, expenses });
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/report-data', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Get income and expenses per month
    const [incomeRows] = await connection.query(
      `SELECT MONTH(date) AS month, SUM(amount) AS total 
       FROM income 
       WHERE user_id = ? AND YEAR(date) = YEAR(CURRENT_DATE()) 
       GROUP BY MONTH(date)`,
      [req.user.id]
    );

    const [expenseRows] = await connection.query(
      `SELECT MONTH(date) AS month, SUM(amount) AS total 
       FROM expense 
       WHERE user_id = ? AND YEAR(date) = YEAR(CURRENT_DATE()) 
       GROUP BY MONTH(date)`,
      [req.user.id]
    );

    // Get category data for doughnut chart
    const [categoryRows] = await connection.query(
      `SELECT category, SUM(amount) AS total 
       FROM expense 
       WHERE user_id = ? 
       GROUP BY category 
       ORDER BY total DESC`,
      [req.user.id]
    );

    connection.release();

    // Labels: Jan to Dec
    const labels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const income = Array(12).fill(0);
    const expenses = Array(12).fill(0);
    incomeRows.forEach(row => {
      income[row.month - 1] = row.total;
    });
    expenseRows.forEach(row => {
      expenses[row.month - 1] = row.total;
    });

    const categoryData = categoryRows.map(row => row.total);
    const categoryLabels = categoryRows.map(row => row.category);

    res.json({
      labels,
      income,
      expenses,
      categoryData,
      categoryLabels
    });
  } catch (error) {
    console.error('Error in /api/report-data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get total income for a specific month and year
app.get('/api/incomes/total/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const connection = await pool.getConnection();

    const [totalIncome] = await connection.query(
      'SELECT SUM(amount) AS totalIncome FROM income WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?',
      [req.user.id, year, month]
    );

    connection.release();

    res.json({ totalIncome: totalIncome[0].totalIncome || 0 });
  } catch (error) {
    console.error('Error fetching total income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Compare total income and expenses for a specific month
app.get('/api/financial-comparison/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;

    // Fetch total income
    const [totalIncome] = await pool.query(
      'SELECT SUM(amount) AS totalIncome FROM income WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?',
      [req.user.id, year, month]
    );

    // Fetch total expenses
    const [totalExpense] = await pool.query(
      'SELECT SUM(amount) AS totalExpense FROM expense WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?',
      [req.user.id, year, month]
    );

    const income = totalIncome[0].totalIncome || 0;
    const expense = totalExpense[0].totalExpense || 0;

    // Calculate the difference
    const balance = income - expense;

    res.json({
      income,
      expense,
      balance,
      message: balance >= 0 ? 'Surplus' : 'Deficit',
    });
  } catch (error) {
    console.error('Error comparing income and expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Initialize database and start server
// Health check endpoint (for Render)
app.get('/healthz', (req, res) => {
  res.send('OK');
});

// Initialize database and start server
(async () => {
  await initDb();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

app.get('/', (req, res) => {
  res.send('Backend server is up and running!');
});
