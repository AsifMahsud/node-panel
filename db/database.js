const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const bcrypt = require('bcrypt');
const saltRounds = 10;

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    creator_name TEXT,
    email TEXT UNIQUE,
    phone_number TEXT,
    password TEXT
  )
`);

const hashPassword = (password, callback) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      callback(err, hash);
    });
  };

const addUser = (user) => {
   hashPassword(user.password, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }

    db.run(
      'INSERT INTO users (first_name, last_name, creator_name, email, phone_number, password) VALUES (?, ?, ?, ?, ?, ?)',
      [user.first_name, user.last_name, user.creator_name, user.email, user.phone_number, hashedPassword]
    );
  });
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
