const {PrismaClient } = require('@prisma/client');
const { use } = require('../routes');

const prisma = new PrismaClient()

//return all Posts
const getAllComments = ()=>{
    return prisma.Comment.findMany();
}   

//return a specific Comment with the id given as a param 
const getComment = (id)=>{
    return prisma.Comment.findUnique({where: {id}});
}

//Add a Comment 
const addComment = (com)=>{
    return prisma.Comment.create({
        data: com
    })  
}   

//Delete a Comment 
const deleteComment = (id)=>{
    return prisma.Comment.delete({
        where: {id},
    })
}

//Update a Comment
const updateComment = (com)=>{
    return prisma.Comment.update({
        where: {id: com.id},
        data: com
    })
}


module.exports = {getAllComments, getComment,  
    addComment, deleteComment, updateComment}