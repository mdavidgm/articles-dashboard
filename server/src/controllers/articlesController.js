const {
    fetchArticles,
    fetchArticleById,
    generateMockSummary
  } = require('../services/articlesService');
  
  const getArticles = async (req, res) => {
    try {
      const articles = await fetchArticles(req.query);
      res.json(articles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching articles' });
    }
  };
  
  const getArticleById = async (req, res) => {
    try {
      const article = await fetchArticleById(req.params.id);
      if (!article) return res.status(404).json({ error: 'Article not found' });
      res.json(article);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching article' });
    }
  };
  
  const summarizeArticle = async (req, res) => {
    try {
      const summary = await generateMockSummary(req.params.id);
      res.json(summary);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error generating summary' });
    }
  };
  
  module.exports = {
    getArticles,
    getArticleById,
    summarizeArticle
  };
  