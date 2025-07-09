const { fetchHighlights } = require('../services/highlightsService');

const getHighlights = async (req, res) => {
  try {
    const highlights = await fetchHighlights(req.query.author);
    res.json(highlights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching highlights' });
  }
};

module.exports = {
  getHighlights
};