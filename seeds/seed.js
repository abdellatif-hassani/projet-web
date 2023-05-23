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


//Creating 100 posts
async function createArticles(users, categories) {
  const articles = await Promise.all(
    Array.from({ length: 100 }, async () => {
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
          },
          comments: {
            create: Array.from({ length: Math.floor(Math.random() * 21) }, () => {
              const randomUser = users[Math.floor(Math.random() * users.length)];
              return {
                email: randomUser.email,
                content: faker.lorem.sentences(),
                user: {
                  connect: { id: randomUser.id }
                }
              };
            })
          }
        },
        include: {
          comments: true
        }
      });
      return article;
    })
  );
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




//Script to delete all data from DataBase 
async function deleteData() {
  // Delete all comments
  await prisma.comment.deleteMany();

  // Delete all posts
  await prisma.post.deleteMany();

  // Delete all users
  await prisma.user.deleteMany();

  // Delete all categories
  await prisma.category.deleteMany();

  console.log('Data deleted successfully.');
}

// deleteData()
//   .catch((error) => {
//     console.error(error);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

seed();
