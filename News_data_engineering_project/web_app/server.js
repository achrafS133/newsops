const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read JSON data
const readData = async (filename) => {
  try {
    const dataPath = path.join(__dirname, 'data', filename);
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// API Routes

// Metrics
app.get('/api/metrics', async (req, res) => {
  const data = await readData('metrics.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Recent Articles
app.get('/api/articles', async (req, res) => {
  const data = await readData('articles.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Category Stats
app.get('/api/categories', async (req, res) => {
  const data = await readData('categories.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Serving local project data)`);
});
