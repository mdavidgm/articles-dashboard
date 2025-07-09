const express = require('express');
const router = express.Router();
const { getHighlights } = require('../../controllers/highlightsController');

router.get('/', getHighlights);

module.exports = router;