const {PrismaClient } = require('@prisma/client');
const { use } = require('../routes');

const prisma = new PrismaClient()

//return all Posts
const getAllPosts = ()=>{
    return prisma.post.findMany();
}   

//return a specific Post with the id given as a param 
const getPost = (id)=>{
    return prisma.post.findUnique({where: {id}});
}

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