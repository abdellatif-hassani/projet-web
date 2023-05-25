var express = require('express');
var router = express.Router();

const {getAllCategories, getCategorie, 
    addCategorie, deleteCategorie, updateCategorie} = require('../models/categories');


/* Récupérer take catégories à partir de la position
skip. */
router.get('/', async function(req, res, next) {
    // getAllCategories().then(categories=>res.json(categories))
    try {
        const categories = await getAllCategories();
        res.json({categories}); // Pass the fetched posts to the template engine
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Récupérer une catégorie ayant l’id donné
router.get('/:id', function(req, res, next) {
    getCategorie(+req.params.id)
        .then(categorie=>res.json(categorie))
});

// Ajouter une nouveau catégorie envoyé sous format JSON
router.post('/', function(req, res, next) {
    addCategorie(req.body).then(categorie=>res.json(categorie))
});

// Mettre à jour la catégorie envoyé dans le corps de la requête.
router.put('/', function(req, res, next) {
    updateCategorie(req.body).then(categorie=>res.json(categorie))
});

// Supprimer la catégorie ayant l’id donné.
router.delete('/:id', function(req, res, next) {
    deleteCategorie(+req.params.id).then(categorie=>res.json(categorie))
});


module.exports = router;
