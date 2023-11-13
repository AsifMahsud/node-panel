const express = require('express');
const { validateSignupInput } = require('../validation');

const router = express.Router();

const users = {};

router.post('/signup', (req, res) => {
  const validationErrors = validateSignupInput(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const {
    first_name,
    last_name,
    creator_name,
    email,
    phone_number,
    password,
  } = req.body;

  users[email] = {
    first_name,
    last_name,
    creator_name,
    email,
    phone_number,
    password,
  };

  res.json({ message: 'Signup successful!' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
      const token = jwt.sign({ username, role: users[username].role }, secretKey);
      res.json({ token });
  } else {
      res.status(401).json({ error: 'Invalid username or password' });
  }
});

module.exports = router;
