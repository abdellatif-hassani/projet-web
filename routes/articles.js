var express = require('express');
var router = express.Router();

const {getAllPosts, getPost,  
        addPost, deletePost, getPostsOfUser,
        updatePost,getPostsOfCategory} = require('../models/articles');

/* Récupérer take articles à partir de la position
skip. */
 router.get('/', async function(req, res, next) {
       try {
         const posts = await getAllPosts();
        res.json({posts}); // Pass the fetched posts to the template engine
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
      }
});

// retreive posts a specific categorie
router.get('/categorie/:id', async function(req, res, next) {
    const idCategorie = +req.params.id;
    try {
      const posts = await getPostsOfCategory(idCategorie);
      res.json({posts}); // Pass the fetched posts to the template engine
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({message:'Internal Server Error'});
    }
});

// retreive posts a specific user
router.get('/user/:id', async function(req, res, next) {
  const userId = +req.params.id;
  try {
    const posts = await getPostsOfUser(userId);
    res.json({posts}); // Pass the fetched posts to the template engine
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({message:'Internal Server Error'});
  }
});

// retreive post with id given
router.get('/:id', async function(req, res, next) {
  try {
        const post = await getPost(+req.params.id);
        res.json({post}); 
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
      }
});

// Ajouter un nouveau article envoyé sous format JSON
router.post('/', async function(req, res, next) {
  try {
    const {authorId, title, content, photo } = req.body;
    const postData = {
      authorId,
      title,
      content,
      photo
    };
    await addPost(postData).then(post=>res.json(post))
    // res.json(req.body)
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Mettre à jour l’article envoyé dans le corps de la requête.
router.patch('/', function(req, res, next) {
    updatePost(req.body).then(post=>res.json(post))
});

// Supprimer l’article ayant l’id donné.
router.delete('/:id', async function(req, res, next) {
    await deletePost(+req.params.id).then(post=>res.json(post))
});


module.exports = router;


