// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the request header
  const authHeader = req.headers['authorization'];
  
  // The header format is usually "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach the decoded user data to the request object
    req.user = decoded;
    
    // 5. Move to the next function (the actual route)
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;