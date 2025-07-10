const articlesController = require('../../src/controllers/articlesController');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
});

describe('Articles Controller - Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.summary.deleteMany();
    await prisma.article.deleteMany();

    await prisma.article.create({
      data: {
        id: 1,
        title: 'Integration Test Article 1',
        author: 'Test Author',
        content: 'Content for integration test article 1.',
        views: 100,
        shares: 10,
        createdAt: new Date('2023-01-15T10:00:00Z'),
      },
    });

    await prisma.article.create({
      data: {
        id: 2,
        title: 'Another Test Article',
        author: 'Another Author',
        content: 'Content for another test article.',
        views: 200,
        shares: 20,
        createdAt: new Date('2023-02-20T11:30:00Z'),
      },
    });

    await prisma.article.create({
      data: {
        id: 3,
        title: 'Article with more views',
        author: 'Author Z',
        content: 'Content for article with more views.',
        views: 300,
        shares: 15,
        createdAt: new Date('2023-03-01T14:00:00Z'),
      },
    });

    await prisma.article.create({
      data: {
        id: 4,
        title: 'Article with more shares',
        author: 'Author Z',
        content: 'Content for article with more shares.',
        views: 150,
        shares: 25,
        createdAt: new Date('2023-04-01T15:00:00Z'),
      },
    });

    await prisma.summary.create({
      data: {
        articleId: 1,
        summary: 'Summary for Integration Test Article 1',
      },
    });
  });

  afterEach(async () => {
    await prisma.summary.deleteMany();
    await prisma.article.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getArticles', () => {
    test('should return a list of articles from the database', async () => {
      const req = { query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await articlesController.getArticles(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      const articles = res.json.mock.calls[0][0].articlesData;
      expect(articles.length).toBeGreaterThanOrEqual(2);
      expect(articles.some(a => a.title === 'Integration Test Article 1')).toBe(true);
      expect(articles.some(a => a.title === 'Another Test Article')).toBe(true);
      const totalCount = res.json.mock.calls[0][0].totalCount;
      expect(totalCount).toBe(4);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    test('should return articles filtered by author', async () => {
      const req = { query: { author: 'Test Author' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await articlesController.getArticles(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      const articles = res.json.mock.calls[0][0].articlesData;
      expect(articles).toHaveLength(1);
      expect(articles[0].author).toBe('Test Author');
      const totalCount = res.json.mock.calls[0][0].totalCount;
      expect(totalCount).toBe(1);
    });

    test('should return articles sorted by views in descending order', async () => {
      const req = { query: { sort: 'views', order: 'desc' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await articlesController.getArticles(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      const articles = res.json.mock.calls[0][0].articlesData;
      expect(articles.length).toBeGreaterThanOrEqual(4);
      expect(articles[0].title).toBe('Article with more views');
      expect(articles[0].views).toBe(300);
      expect(articles[1].title).toBe('Another Test Article');
      expect(articles[1].views).toBe(200);
      const totalCount = res.json.mock.calls[0][0].totalCount;
      expect(totalCount).toBe(4);
    });

    test('should return articles sorted by shares in ascending order', async () => {
      const req = { query: { sort: 'shares', order: 'asc' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await articlesController.getArticles(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      const articles = res.json.mock.calls[0][0].articlesData;
      expect(articles.length).toBeGreaterThanOrEqual(4);
      expect(articles[0].title).toBe('Integration Test Article 1');
      expect(articles[0].shares).toBe(10);
      expect(articles[1].title).toBe('Article with more views');
      expect(articles[1].shares).toBe(15);
      const totalCount = res.json.mock.calls[0][0].totalCount;
      expect(totalCount).toBe(4);
    });
  });

  describe('getArticleById', () => {
    test('should return a single article by ID from the database', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await articlesController.getArticleById(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      const article = res.json.mock.calls[0][0];
      expect(article.id).toBe(1);
      expect(article.title).toBe('Integration Test Article 1');
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    test('should return 404 if article not found in the database', async () => {
      const req = { params: { id: '999' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await articlesController.getArticleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Article not found' });
    });
  });

  describe('summarizeArticle', () => {
    test('should generate and return a summary for an article', async () => {
      const req = { params: { id: '2' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      try {
        await articlesController.summarizeArticle(req, res);
      } catch (error) {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error generating summary' });
      }

      expect(res.json).toHaveBeenCalledTimes(1);
      const summary = res.json.mock.calls[0][0];
      expect(summary.articleId).toBe(2);
      expect(summary.summary).toContain('MOCKED SUMMARY:');
      expect(res.status).not.toHaveBeenCalledWith(500);

      const storedSummary = await prisma.summary.findUnique({ where: { articleId: 2 } });
      expect(storedSummary).not.toBeNull();
      expect(storedSummary.summary).toContain('MOCKED SUMMARY:');
    });

    test('should return 500 if article to summarize is not found', async () => {
      const req = { params: { id: '999' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await articlesController.summarizeArticle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error generating summary' });
    });
  });
});
