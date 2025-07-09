const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  await prisma.summary.deleteMany();
  await prisma.article.deleteMany();
  console.log('Existing data deleted.');

  const numberOfArticles = 50;
  const articlesToCreate = [];

  for (let i = 0; i < numberOfArticles; i++) {
    articlesToCreate.push({
      title: faker.lorem.sentence(5),
      author: faker.person.fullName(),
      content: faker.lorem.paragraphs(30),
      views: faker.number.int({ min: 100, max: 5000 }),
      shares: faker.number.int({ min: 10, max: 500 }),
      createdAt: faker.date.past({ years: 2 }),
    });
  }

  const createdArticles = [];
  for (const articleData of articlesToCreate) {
    const article = await prisma.article.create({
      data: articleData,
    });
    createdArticles.push(article);
    console.log(`Article created: "${article.title}"`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
