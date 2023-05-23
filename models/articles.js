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
const addPost = (article)=>{
    return prisma.post.create({
        data: article
    })  
}   

//Delete a Post 
const deletePost = (id)=>{
    return prisma.post.delete({
        where: {id},
    })
}

//Update a Post
const updatePost = (article)=>{
    return prisma.post.update({
        where: {id: article.id},
        data: article
    })
}


module.exports = {getAllPosts, getPost,  
    addPost, deletePost, updatePost}