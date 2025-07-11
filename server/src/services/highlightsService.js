const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//cite_start: Delay to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchHighlights = async (author) => {
  await delay(1000);
  const where = author ? { author: { equals: author } } : {};

  const [mostViewed] = await prisma.article.findMany({
    where,
    orderBy: { views: 'desc' },
    take: 1,
  });

  const [mostShared] = await prisma.article.findMany({
    where,
    orderBy: { shares: 'desc' },
    take: 1,
  });

  return { mostViewed, mostShared };
};

module.exports = {
  fetchHighlights
};