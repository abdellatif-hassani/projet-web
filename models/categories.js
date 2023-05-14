const {PrismaClient } = require('@prisma/client');
const { use } = require('../routes');

const prisma = new PrismaClient()

//return all Categories
const getAllCategories = ()=>{
    return prisma.Category.findMany();
}   

//return a specific Categorie with the id given as a param 
const getCategorie = (id)=>{
    return prisma.Category.findUnique({where: {id}});
}

//Add a Categorie 
const addCategorie = (cat)=>{
    return prisma.Category.create({
        data: cat
    })  
}   

//Delete a Categorie 
const deleteCategorie = (id)=>{
    return prisma.Category.delete({
        where: {id},
    })
}

//Update Categorie
const updateCategorie = (cat)=>{
    return prisma.Category.update({
        where: {id: cat.id},
        data: cat
    })
}


module.exports = {getAllCategories, getCategorie, 
    addCategorie, deleteCategorie, updateCategorie}