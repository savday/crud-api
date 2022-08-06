const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  database: 'faqs'
});

const router = express.Router();

// CREATE ONE
router.post('/', async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = await pool.query('INSERT INTO faq (question, answer) VALUES($1, $2) RETURNING *', [question, answer]);

    res.json(newFAQ.rows[0]);
  } catch (error) {
    next(error);
  }
});

// READ All
router.get('/', async (req, res, next) => {
  try {
    const allFAQs = await pool.query('SELECT * FROM faq');

    res.json(allFAQs.rows);
  } catch (error) {
    next(error);
  }
});

// UPDATE ONE
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await pool.query('SELECT * FROM faq WHERE faq_id = $1', [id]);

    res.json(faq.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE ONE
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM faq WHERE faq_id = $1', [id]);

    res.json('FAQ was deleted');
  } catch (error) {
    next(error);
  }
});

// and then export it
module.exports = router;
