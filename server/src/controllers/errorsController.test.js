const articlesController = require('../../src/controllers/articlesController');
const highlightsController = require('../../src/controllers/highlightsController');
const articlesService = require('../../src/services/articlesService');
const highlightsService = require('../../src/services/highlightsService');

jest.mock('../../src/services/articlesService');
jest.mock('../../src/services/highlightsService');

describe('Controllers - Error Handling Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    articlesService.fetchArticles.mockRestore();
    articlesService.fetchArticleById.mockRestore();
    articlesService.generateMockSummary.mockRestore();
    highlightsService.fetchHighlights.mockRestore();
  });

  describe('Articles Controller Error Handling', () => {
    describe('getArticles', () => {
      test('should handle errors when fetching articles', async () => {
        articlesService.fetchArticles.mockRejectedValue(new Error('Simulated fetchArticles error'));

        const req = { query: {} };
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };

        await articlesController.getArticles(req, res);

        expect(articlesService.fetchArticles).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching articles' });
      });
    });

    describe('getArticleById', () => {
      test('should handle errors when fetching article by ID', async () => {
        articlesService.fetchArticleById.mockRejectedValue(new Error('Simulated fetchArticleById error'));

        const req = { params: { id: '1' } };
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };

        await articlesController.getArticleById(req, res);

        expect(articlesService.fetchArticleById).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching article' });
      });
    });

    describe('summarizeArticle', () => {
      test('should handle errors when generating summary', async () => {
        articlesService.generateMockSummary.mockRejectedValue(new Error('Simulated summary error'));

        const req = { params: { id: '1' } };
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };

        await articlesController.summarizeArticle(req, res);

        expect(articlesService.generateMockSummary).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error generating summary' });
      });
    });
  });

  describe('Highlights Controller Error Handling', () => {
    test('should handle errors when fetching highlights', async () => {
      highlightsService.fetchHighlights.mockRejectedValue(new Error('Simulated service error'));

      const req = { query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await highlightsController.getHighlights(req, res);

      expect(highlightsService.fetchHighlights).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching highlights' });
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
