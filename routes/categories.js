var express = require('express');
var router = express.Router();

const {getAllCategories, getCategorie, 
    addCategorie, deleteCategorie, updateCategorie} = require('../models/categories');


/* Récupérer take catégories à partir de la position
skip. */
router.get('/', function(req, res, next) {
    getAllCategories().then(categories=>res.json(categories))
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
