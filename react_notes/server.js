const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow your React app's origin
  credentials: true,
}));

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', //or postgres
  host: 'localhost',
  database: 'Notes2',
  password: '5tlashat',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API routes
// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
});

// GET notes by category
app.get('/api/notes', async (req, res) => {
  const { category } = req.query;
  try {
    let query = 'SELECT * FROM notes';
    let values = [];
    if (category) {
      query += ' WHERE category_id = $1';
      values.push(category);
    }
    query += ' ORDER BY id';
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching notes' });
  }
});

// POST a new note
app.post('/api/notes', async (req, res) => {
  const { german, english, categoryId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notes (german, english, category_id) VALUES ($1, $2, $3) RETURNING *',
      [german, english, categoryId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the note' });
  }
});

// DELETE a note
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the note' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});