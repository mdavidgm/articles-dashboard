const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  summarizeArticle
} = require('../../controllers/articlesController');

router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/:id/summarize', summarizeArticle);

module.exports = router;