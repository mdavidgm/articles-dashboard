const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fetchArticles = async ({ author, sort, order = 'desc', page = 1, limit = 10 }) => {
  const where = author ? { author: { equals: author } } : {};
  const orderBy = sort ? { [sort]: order } : {};
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
      include: { summary: true },//cite_start: include summary in the result if it exists because it has been generated before
    }),
    prisma.article.count({
      where,
    }),
  ]);

  return { data: articles, totalCount: totalCount };
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
  //cite_start: Simulate summary generation and update if exsits and insert if not
  //it is a good practice jsut in case content changes, as it is in a db it could happen,
  //and we would generate the summary still properly.
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
