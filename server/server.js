const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('../db/tic_tac_toe.db');

// Middleware to parse JSON
app.use(express.json());

// Initialize database and create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    wins INTEGER DEFAULT 0
  )`);

  // Insert initial data for two players if they don't exist
  db.run(`INSERT OR IGNORE INTO players (name) VALUES ('Player X'), ('Player O')`);
});

// Get player stats
app.get('/stats', (req, res) => {
  db.all("SELECT * FROM players", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ players: rows });
  });
});

// Update player stats
app.post('/update', (req, res) => {
  const { player, result } = req.body;
  if (result === 'win') {
    db.run(`UPDATE players SET wins = wins + 1 WHERE name = ?`, [player], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Win recorded' });
    });
  } else {
    res.status(400).json({ error: 'Invalid result' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
