var express = require('express');
var router = express.Router();


const {addUser} = require('../models/users');
//for login
//bcrypt for hashing password
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



//create a user 
router.post('/newAccount',(req,res,next)=>{
    addUser(req.body).then(user=>res.json(user))
    .catch((error) => {
        res.status(400).json({ error: error.message });
    });
})



module.exports = router;
