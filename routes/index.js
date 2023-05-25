var express = require('express');
var router = express.Router();


// const {getAllPosts} = require('../models/articles');
const {getUserByEmail} = require('../models/users');

//for login
//bcrypt for hashing password
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/* GET home page. */
router.get('/', function(req, res, next) {
  const tokenCookie = req.cookies.token;
  // sending tokenCookie to the index.ejs file to test if the user is authentificated
  res.render('index', { tokenCookie });
});


//login 
router.post('/login', async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;
  const user = await getUserByEmail(email)
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  // const passwordMatch = (password==user.password)?1:0
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  // Generate a JWT token and return it to the user
  const jwt = require('jsonwebtoken');

  const token = jwt.sign({ userId: user.id, name: user.name, email: user.email,
       role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_TIME });

  res.cookie("token", token, {
    // httpOnly: true,
    expires: new Date(Date.now() + 900000)
    // secure: true,
    // maxAge: 10000000000,
    // signed:true
  })
  // return res.redirect('/')
  return res.json({redirect :'/', message: 'Logged in successfully'});
});


//Logout 
router.post('/logout', function(req, res) {
  // Clear the cookie
  res.clearCookie('token');

  // Send a response indicating successful logout
  return res.json({message :'Logged out successfully',redirect :'/'});

});


module.exports = router;
