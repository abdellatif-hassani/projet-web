const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];

    // console.log(token)
    // console.log(authHeader)
    if (!token) {
        return res.status(401).send('Authorization header missing');
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.userId = decodedToken.userId;
      next();
    } catch (err) {
      return res.status(401).send('Invalid token');
    }
  }

  module.exports = {authMiddleware}