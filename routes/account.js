var express = require('express');
var router = express.Router();


const {addUser} = require('../models/users');
//for login
//bcrypt for hashing password
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//login 
router.post('/login', async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).send('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  // const passwordMatch = (password==user.password)?1:0
  if (!passwordMatch) {
    console.log(user.password)
    return res.status(401).send('Incorrect password');
  }

  // Generate a JWT token and return it to the user
  const jwt = require('jsonwebtoken');

  const token = jwt.sign({ userId: user.id, email: user.email,
       role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_TIME });

  res.cookie("token", token, {
    httpOnly: true,
    // secure: true,
    // maxAge: 1000000,
    // signed:true
  })
  console.log(req.cookies.token)
  // return res.redirect('/')
  return res.json({redirect :'/'});

});


//Logout 
router.post('/logout', function(req, res) {
  // Clear the cookie
  res.clearCookie('token');

  // Send a response indicating successful logout
  return res.json({message :'Logged out successfully',redirect :'/'});

});


//create a user 
router.post('/newAccount',(req,res,next)=>{
    addUser(req.body).then(user=>res.json(user))
})

module.exports = router;
