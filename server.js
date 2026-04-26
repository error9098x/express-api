const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Use environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'testdb'
});

// Vulnerability 2: SQL Injection - string concatenation
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Vulnerability 3: NoSQL Injection (if using MongoDB)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Vulnerable to NoSQL injection
  const query = { username: username, password: password };
  
  // Simulated MongoDB query
  // db.collection('users').findOne(query)
  
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

// Missing rate limiting - no throttling
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  
  // No rate limiting allows brute force attacks
  const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
  
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User registered' });
  });
});

// Secure endpoint for comparison
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products WHERE active = ?';
  db.query(query, [true], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
