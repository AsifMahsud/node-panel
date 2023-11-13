const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const signupRoutes = require('./routes/authentication');
const { verifyToken } = require('./middlewares/auth');

require('dotenv').config();


const app = express()
const port = process.env.port || 3000;


app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/protected', verifyToken);
app.use('/admin', signupRoutes);


app.get('/',(req,res)=>{
    res.send('Welcome')
})

app.get('/protected', (req, res) => {
    res.json({ message: 'Welcome to a protected route.' });
});

app.listen(port,()=>{
    console.log(`Serving at #{port}`)
})