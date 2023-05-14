var express = require('express');
var router = express.Router();

//for login
//bcrypt for hashing password
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//login 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).send('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  // const passwordMatch = (password==user.password)?1:0
  if (!passwordMatch) {
    return res.status(401).send('Incorrect password');
  }

  // Generate a JWT token and return it to the user
  const jwt = require('jsonwebtoken');

  const token = jwt.sign({ userId: user.id, email: user.email,
       role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
  // localStorage.setItem('token', token);
  res.json({ token });

});

module.exports = router;
