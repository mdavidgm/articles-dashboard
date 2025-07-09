const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  await prisma.summary.deleteMany();
  await prisma.article.deleteMany();
  console.log('Existing data deleted.');

  const numberOfArticles = 34;
  const articlesToCreate = [];

  articlesToCreate.push(
    {
      title: 'Understanding React Hooks',
      author: 'Kent C. Dodds',
      content: faker.lorem.paragraphs(30),
      views: 9999,
      shares: 555,
      createdAt: faker.date.past({ years: 2 }),
    },
    {
      title: 'Advanced JavaScript Patterns',
      author: 'Kent C. Dodds',
      content: faker.lorem.paragraphs(30),
      views: 10000,
      shares: 900,
      createdAt: faker.date.past({ years: 2 }),
    }
  );

  articlesToCreate.push(
    {
      title: 'The Fellowship of the Ring',
      author: 'J. R. R. Tolkien',
      content: faker.lorem.paragraphs(30),
      views: 400,
      shares: 400,
      createdAt: faker.date.past({ years: 2 }),
    },
    {
      title: 'The Two Towers',
      author: 'J. R. R. Tolkien',
      content: faker.lorem.paragraphs(30),
      views: 300,
      shares: 300,
      createdAt: faker.date.past({ years: 2 }),
    },
    {
      title: 'The Return of the King',
      author: 'J. R. R. Tolkien',
      content: faker.lorem.paragraphs(30),
      views: 341,
      shares: 123,
      createdAt: faker.date.past({ years: 2 }),
    }
  );

  articlesToCreate.push(
    {
      title: 'Interview with the Vampire',
      author: 'Anne Rice',
      content: faker.lorem.paragraphs(30),
      views: 1,
      shares: 1,
      createdAt: faker.date.past({ years: 2 }),
    }
  );

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
