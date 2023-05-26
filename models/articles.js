const {PrismaClient } = require('@prisma/client');
const { use } = require('../routes');

const prisma = new PrismaClient()

//return all Posts
const getAllPosts = (take = 10 , skip = 0)=>{
    return prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include:{
            author:true
        },
        take,
        skip
    });
}   

// Return posts of a user
const getPostsOfUser = (userId) => {
  return prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
    },
    where: {
      authorId: userId, // Filter posts by user ID
    },
  });
};

//return Posts of a categorie
const getPostsOfCategory = (id) => {
    return prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        categories: true, // Include the associated categories
      },
      where: {
        categories: {
          some: {
            id: id, // Filter posts by category id
          },
        },
      },
      take:10
    });
  };
  

//return a specific Post with the id given as a param 
const getPost = (id) => {
    return prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            user: {
              select: { name: true }
            }
          }
        },
        author: true
      }
    });
  };


//Add a Post 
const addPost = async (postData) => {
  const randomInt = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  try {
    var { authorId, title, content, photo } = postData;
    photoSrc = `https://picsum.photos/300/100/?${randomInt}`
    console.log(authorId)
    const parsedAuthorId = parseInt(authorId, 10);
    const post = await prisma.post.create({
      data: {
        title,
        content,
        photo:photoSrc,
        author: {
          connect: { id: parsedAuthorId }
        }
      },
      include: {
        author: true
      }
    });
    return post;
  } catch (error) {
    throw new Error('Error adding post');
  }
};



//Delete a Post 
const deletePost = async(postId)=>{
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { comments: true },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { postId: post.id } }),
      prisma.post.delete({ where: { id: post.id } }), 
    ]);

    return post;
  } catch (error) {
    console.error('Error deleting post and associated comments:', error);
  }
}

//Update a Post
const updatePost = (article)=>{
  const postId = parseInt(article.id);
    return prisma.post.update({
        where: {id: postId},
        data: {
          title: article.title,
          content: article.content,
          photo: article.photo
        }
    })
}


module.exports = {getAllPosts, getPost, getPostsOfUser,
    addPost, deletePost, updatePost, getPostsOfCategory}