var express = require('express');
var router = express.Router();

const {getAllPosts, getPost,  
        addPost, deletePost,
        updatePost} = require('../models/articles');

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

// Récupérer un article ayant l’id donné
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
router.post('/', function(req, res, next) {
    addPost(req.body).then(post=>res.json(post))
    // res.json(req.body)
});

// Mettre à jour l’article envoyé dans le corps de la requête.
router.patch('/', function(req, res, next) {
    updatePost(req.body).then(post=>res.json(post))
});

// Supprimer l’article ayant l’id donné.
router.delete('/:id', function(req, res, next) {
    deletePost(+req.params.id).then(post=>res.json(post))
});


module.exports = router;


