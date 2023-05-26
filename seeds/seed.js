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
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: 'admin@example.com'
    }
  });
  if (existingAdmin) {
    const admin = await prisma.user.update({
      where: {
        id: existingAdmin.id
      },
      data: {
        name: 'admin',
        password: 'adminpass',
        role: 'ADMIN'
      }
    });
    return admin;
  }
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
  var i=0
  const articles = await Promise.all(
    Array.from({ length: 100 }, async () => {
      let lastPost = null;
      // Check if any posts exist in the database
      const existingPosts =  prisma.post.findMany();
      if (existingPosts.length > 0) {
        lastPost = await prisma.post.findFirst({
          orderBy: {
            id: 'desc'
          }
        });
      }
      const photo = lastPost ? `https://picsum.photos/300/100/?${lastPost.id}` : `https://picsum.photos/300/100/?${++i}`;
      const article = await prisma.post.create({
        data: {
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          photo: photo,
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
  deleteData().then(async ()=>{
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
  })
}


async function deleteData() {
  await prisma.comment.deleteMany();

  await prisma.post.deleteMany();

  await prisma.user.deleteMany();

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
