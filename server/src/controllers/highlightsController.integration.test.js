const highlightsController = require('../../src/controllers/highlightsController');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
});

describe('Highlights Controller - Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.summary.deleteMany();
    await prisma.article.deleteMany();

    await prisma.article.createMany({
      data: [
        { id: 1, title: 'Article A (Most Viewed)', author: 'Author X', content: '...', views: 500, shares: 50, createdAt: new Date('2024-01-01T10:00:00Z') },
        { id: 2, title: 'Article B (Most Shared)', author: 'Author Y', content: '...', views: 100, shares: 150, createdAt: new Date('2024-01-02T11:00:00Z') },
        { id: 3, title: 'Article C (Normal)', author: 'Author X', content: '...', views: 200, shares: 20, createdAt: new Date('2024-01-03T12:00:00Z') },
        { id: 4, title: 'Article D (Less Viewed)', author: 'Author Z', content: '...', views: 50, shares: 10, createdAt: new Date('2024-01-04T13:00:00Z') },
      ],
    });
  });

  afterEach(async () => {
    await prisma.summary.deleteMany();
    await prisma.article.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getHighlights', () => {
    test('should return mostViewed and mostShared articles by default', async () => {
      const req = { query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await highlightsController.getHighlights(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      const highlights = res.json.mock.calls[0][0];

      expect(highlights.mostViewed).toBeDefined();
      expect(highlights.mostViewed.title).toBe('Article A (Most Viewed)');
      expect(highlights.mostViewed.views).toBe(500);

      expect(highlights.mostShared).toBeDefined();
      expect(highlights.mostShared.title).toBe('Article B (Most Shared)');
      expect(highlights.mostShared.shares).toBe(150);

      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    test('should return filtered highlights by author when author is provided', async () => {
      const req = { query: { author: 'Author X' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await highlightsController.getHighlights(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      const highlights = res.json.mock.calls[0][0];

      expect(highlights.mostViewed.title).toBe('Article A (Most Viewed)');
      expect(highlights.mostViewed.views).toBe(500);
      expect(highlights.mostShared.title).toBe('Article A (Most Viewed)');
      expect(highlights.mostShared.shares).toBe(50);

      expect(res.status).not.toHaveBeenCalledWith(500);
    });

  });
});
