const express = require('express');
const { validateSignupInput } = require('../requests/validation');
const db = require('../db/database')
const router = express.Router();

const users = {};

router.post('/signup', async(req, res) => {
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

  const result = await db.addUser({
    first_name,
    last_name,
    creator_name,
    email,
    phone_number,
    password,
  });

  if (result.success) {
    res.json({ message: 'Signup successful!' });
  } else {
    res.status(400).json({ error: result.message });
  }
});


module.exports = router;
