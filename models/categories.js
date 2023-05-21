const {PrismaClient } = require('@prisma/client');
const { use } = require('../routes');

const prisma = new PrismaClient()

//return all Categories
const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
      include: {
        posts: true,
      },
    });
  
    // Map the categories and add the count of posts to each category
    const categoriesWithPostCount = categories.map((category) => {
      return {
        ...category,
        postCount: category.posts.length,
      };
    });
    // Sort the categories by the number of posts 
    categoriesWithPostCount.sort((a, b) => b.postCount - a.postCount);
    return categoriesWithPostCount;
};

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