var express = require('express');
var router = express.Router();


const {getAllUsers, getUser, 
      getUserByEmail, addUser,deleteUser,
      updateUser} = require('../models/users');

/* GET users listing.
GET all users
*/
router.get('/', function(req, res, next) {
    getAllUsers().then(users=>res.json(users))
});

//return a specific user with the id given as a param 
router.get('/:id([0-9]+)',(req,res,next)=>{
    getUser(+req.params.id)
      .then(user=>res.json(user))
})
//Search a user by email
router.get('/:email',(req,res,next)=>{
  getUserByEmail(req.params.email)
    .then(user=>res.json(user))
})

//create a user 
router.post('/',(req,res,next)=>{
    addUser(req.body).then(user=>res.json(user))
})

//Delete a user 
router.delete('/:id',(req,res,next)=>{
   deleteUser(+req.params.id).then(user=>res.json(user))
})

//Update a user 
router.patch('/',async (req,res,next)=>{
  try {
    // console.log(req.body)
    const user = await updateUser(req.body);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
})


module.exports = router;
