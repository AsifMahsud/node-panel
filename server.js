const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express()
const port = process.env.port || 3000;
const secretKey = process.env.SECRET_KEY;


app.use(bodyParser.json())
app.use(morgan('dev'))


app.get('/',(req,res)=>{
    res.send('Welcome')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username].password === password) {
        const token = jwt.sign({ username, role: users[username].role }, secretKey);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
  });

  const users = {};

  // ...
  const isEmailUnique = (email)=> {
    return !users[email]
  }
  app.post('/signup', (req, res) => {
    const {
      first_name,
      last_name,
      creator_name,
      email,
      phone_number,
      password,
      password_confirmation,
      accept_terms_conditions,
    } = req.body;
  
    // Validate the input (e.g., check if passwords match, email is unique, etc.)
    // ...
  
    // Add the user to the database (for simplicity, using an in-memory object)
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
  


const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    try {
      
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token.' });
    }
  };
  
app.use('/protected', verifyToken);

  
app.get('/protected', (req, res) => {
    res.json({ message: 'Welcome to a protected route.' });
});

app.listen(port,()=>{
    console.log(`Serving at #{port}`)
})