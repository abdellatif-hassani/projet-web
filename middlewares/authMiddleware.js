const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next) {
    
    const token = req.cookies.token
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