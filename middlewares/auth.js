const jwt = require('jsonwebtoken');

const verifyToken = (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    req.user['success'] = true
    return req.user
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = {
  verifyToken,
};
