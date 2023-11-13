const express = require('express')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser')
const morgan = require('morgan');
const signupRoutes = require('./routes/authentication');
const { verifyToken } = require('./middlewares/auth');

require('dotenv').config();


const app = express()
const port = process.env.port || 3000;

app.use(require('express-session')({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        // Store user information in the session
        return done(null, profile, accessToken,);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  // Deserialize user information from the session
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
app.use(bodyParser.json())
app.use(morgan('dev'))
// app.use('/creator-dashboard', verifyToken);
app.use('/admin', signupRoutes);


app.get('/',(req,res)=>{
    res.send('Welcome')
})

// Initiate Google Sign-In
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle the Google Sign-In callback
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/creator-dashboard');
});

app.get('/creator-dashboard', (req, res) => {
    if(!req.header('Authorization')){
    if (req.isAuthenticated()) {
        res.send(req.user);
      } else {
        res.status(401).json({ error: 'Unauthorized user' });
      }
    }else{
       const tokenValidate = verifyToken(req, res);
        if(tokenValidate.success){
            const referer = req.get('Referer') || '';
            const origin = req.get('Origin') || '';
            const domain = referer ? new URL(referer).origin : origin;
            res.redirect(domain)
        }else{
            res.status(401).json({ error: 'Unauthorized user' });

        }
    }


});

// app.use('/creator-dashboard',verifyToken)
// app.get('/creator-dashboard',(req,res)=>{
//     res.send("Homepage with custom signup")
// })

app.listen(port,()=>{
    console.log(`Serving at ${port}`)
})