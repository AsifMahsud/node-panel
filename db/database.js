const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const isEmailUnique = (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(!row); // Resolve with true if the email is unique, false if it already exists
      });
    });
  };


const hashPassword = (password, callback) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      callback(err, hash);
    });
  };


  const addUser = async (user) => {
    try {
      const hashedPassword = await hashPassword(user.password);
  
      const emailUnique = await isEmailUnique(user.email);
  
      if (emailUnique) {
        db.run(
          'INSERT INTO users (first_name, last_name, creator_name, email, phone_number, password) VALUES (?, ?, ?, ?, ?, ?)',
          [user.first_name, user.last_name, user.creator_name, user.email, user.phone_number, hashedPassword]
        );
      } else {
        console.error('Email is already registered.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

const getUserByEmail = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    callback(err, row);
  });
};

const authenticateUser = (email, password, callback) => {
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    callback(err, row);
  });
};

module.exports = {
  addUser,
  getUserByEmail,
  authenticateUser,
};
