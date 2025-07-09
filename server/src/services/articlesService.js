const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fetchArticles = async ({ author, sort, order = 'desc', page = 1, limit = 10 }) => {
  const where = author ? { author: { equals: author } } : {};

  const orderBy = sort ? { [sort]: order } : {};

  return await prisma.article.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: parseInt(limit),
    include: { summary: true },
  });
};

const fetchArticleById = async (id) => {
  return await prisma.article.findUnique({
    where: { id: parseInt(id) },
    include: { summary: true },
  });
};

const generateMockSummary = async (id) => {
  const article = await fetchArticleById(id);
  if (!article) throw new Error('Article not found');

  const summaryText = `MOCKED SUMMARY: ${article.content.slice(0, 100)}...`;

  return await prisma.summary.upsert({
    where: { articleId: article.id },
    update: { summary: summaryText },
    create: { articleId: article.id, summary: summaryText },
  });
};

module.exports = {
  fetchArticles,
  fetchArticleById,
  generateMockSummary
};
