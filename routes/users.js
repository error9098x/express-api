const express = require('express');
const router = express.Router();
const { createConnection } = require('../config/database');

// Vulnerable endpoint - SQL injection
router.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  const db = createConnection();
  
  const query = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%'`;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
  
  db.end();
});

// Vulnerable endpoint - no input validation
router.post('/update', (req, res) => {
  const { id, email } = req.body;
  const db = createConnection();
  
  const query = `UPDATE users SET email = '${email}' WHERE id = ${id}`;
  
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
  
  db.end();
});

module.exports = router;
