const {PrismaClient } = require('@prisma/client');
const { use } = require('../routes');

const bcrypt = require('bcrypt');
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
const addUser = async(user)=>{
    const pass = user.password;
    const email = user.email
    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
        email,
        },
    }); 
    if (existingUser) {
        throw new Error('User with the same email already exists');
    }
    user.password = await hashPassword(pass);
    const createdUser = await prisma.user.create({
        data: user
    })  
    if(!createdUser)
        throw new Error(`Error`);
    return createdUser;
}   

//Function to hash the password 
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

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