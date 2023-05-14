var express = require('express');
var router = express.Router();

const {getAllComments, getComment,  
        addComment, deleteComment,
        updateComment} = require('../models/commentaires');


/* Récupérer take commentaires à partir de la position
skip. */
router.get('/', function(req, res, next) {
    getAllComments().then(comments=>res.json(comments))
});

// Récupérer un commentaire ayant l’id donné
router.get('/:id([0-9]+)', function(req, res, next) {
    getComment(+req.params.id)
        .then(comment=>res.json(comment))
});

// Ajouter un nouveau commentaire envoyé sous format JSON
router.post('/', function(req, res, next) {
    addComment(req.body).then(comment=>res.json(comment))
});

// Mettre à jour le commentaire envoyé dans le corps de la requête.
router.put('/', function(req, res, next) {
    updateComment(req.body).then(comment=>res.json(comment))
});

// Supprimer le commentaire ayant l’id donné.
router.delete('/:id', function(req, res, next) {
    deleteComment(+req.params.id).then(comment=>res.json(comment))
});


module.exports = router;
