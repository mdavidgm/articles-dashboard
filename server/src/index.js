const express = require('express');
const cors = require('cors');
const articlesRouter = require('./api/routes/articles');
const highlightsRouter = require('./api/routes/highlights');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/articles', articlesRouter);
app.use('/api/highlights', highlightsRouter);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));