var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).send('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send('Incorrect password');
    }

    // Ge nerate a JWT token and return it to the user
    const jwt = require('jsonwebtoken');

    const token = jwt.sign({ userId: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
    res.json({ token });

});

module.exports = router
