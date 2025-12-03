const express = require('express');
const cors = require('cors');
const { createClient } = require('@clickhouse/client');
const neo4j = require('neo4j-driver');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Clients
const clickhouse = createClient({
  host: process.env.CLICKHOUSE_HOST || 'http://clickhouse:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
});

const neo4jDriver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://neo4j:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

// API Routes

// Metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const [total] = await clickhouse.query({
      query: 'SELECT count() FROM news_articles',
      format: 'JSONEachRow',
    }).then(r => r.json());

    const [sentiment] = await clickhouse.query({
      query: 'SELECT avg(sentiment) as val FROM news_articles',
      format: 'JSONEachRow',
    }).then(r => r.json());

    const [sources] = await clickhouse.query({
      query: 'SELECT count(DISTINCT publisher) as val FROM news_articles',
      format: 'JSONEachRow',
    }).then(r => r.json());

    res.json({
      totalArticles: total['count()'],
      avgSentiment: sentiment.val,
      activeSources: sources.val
    });
  } catch (error) {
    console.error('Metrics Error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Recent Articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await clickhouse.query({
      query: `
        SELECT title, publisher, category, sentiment, published_at, topic_label 
        FROM news_articles 
        ORDER BY published_at DESC 
        LIMIT 20
      `,
      format: 'JSONEachRow',
    }).then(r => r.json());
    res.json(articles);
  } catch (error) {
    console.error('Articles Error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Category Stats
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await clickhouse.query({
      query: `
        SELECT category, count() as count, avg(sentiment) as sentiment
        FROM news_articles 
        GROUP BY category 
        ORDER BY count DESC
      `,
      format: 'JSONEachRow',
    }).then(r => r.json());
    res.json(categories);
  } catch (error) {
    console.error('Categories Error:', error);
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
  console.log(`Server running on port ${PORT}`);
});
