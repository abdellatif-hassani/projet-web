const {PrismaClient } = require('@prisma/client');
const { use } = require('../routes');

const prisma = new PrismaClient()

//return all users
const getAllUsers = ()=>{
    return prisma.user.findMany();
}   

//return a specific user with the id given as a param 
const getUser = (id)=>{
    return prisma.user.findUnique({where: {id}});
}
//Search user by email
const getUserByEmail = (email)=>{
    return prisma.user.findUnique({where: {
        email
    }});
}   

//Add a user 
const addUser = (user)=>{
    return prisma.user.create({
        data: user
    })  
}   

//Delete a user 
const deleteUser = (id)=>{
    return prisma.user.delete({
        where: {id},
    })
}

//Update a user
const updateUser = (user)=>{
    return prisma.user.update({
        where: {id: user.id},
        data: user
    })
}


module.exports = {getAllUsers, getUser, getUserByEmail, 
    addUser, deleteUser, updateUser}