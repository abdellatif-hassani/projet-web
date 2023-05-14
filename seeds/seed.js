const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

// Create 10 users with the role "AUTHOR"
async function createUsers() {
  const users = await Promise.all(Array.from({ length: 10 }, async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 20, memorable: true, pattern: /[A-Z]/ }), 
        role: 'USER'
      }
    });
    return user;
  }));
  return users;
}

// Create 1 user with the role "ADMIN"
async function createAdmin() {
  const admin = await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@example.com',
      password: 'adminpass', 
      role: 'ADMIN'
    }
  });
  return admin;
}

// Create 10 categories
async function createCategories() {
  const categories = await Promise.all(Array.from({ length: 10 }, async () => {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.department()
      }
    });
    return category;
  }));
  return categories;
}

// Create 100 articles
async function createArticles(users, categories) {
  const articles = await Promise.all(Array.from({ length: 100 }, async () => {
    const article = await prisma.post.create({
      data: {
        title: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        photo: faker.image.technics(1234, 2345),
        author: {
          connect: { id: users[Math.floor(Math.random() * users.length)].id }
        },
        categories: {
          connect: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => {
            return { id: categories[Math.floor(Math.random() * categories.length)].id };
          })
        }
      }
    });

    // Create 0 to 20 comments for each article
    await Promise.all(Array.from({ length: Math.floor(Math.random() * 21) }, async () => {
      const comment = await prisma.comment.create({
        data: {
            email: faker.internet.email(),  
            content: faker.lorem.sentences()
        }
      });
      return comment;
    }));
  }));
  return articles;
}

async function seed() {
  try {
    const users = await createUsers();
    const admin = await createAdmin();
    const categories = await createCategories();
    const articles = await createArticles(users, categories);
    console.log('Data seeded successfully.');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// seed();