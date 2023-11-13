const sqlite3 = require('sqlite3').verbose();
const {errors} = require('../responses/error_bag')
const users = {};

const validateSignupInput = (data) => {
  const {
    first_name,
    last_name,
    creator_name,
    email,
    phone_number,
    password,
    password_confirmation,
    accept_terms_conditions,
  } = data;


  if (
    !first_name ||
    !last_name ||
    !creator_name ||
    !email ||
    !phone_number ||
    !password ||
    !password_confirmation ||
    !accept_terms_conditions
  ) {
    errors.push('All fields are required.');
  }
  if (password !== password_confirmation) {
    errors.push('Passwords do not match.');
  }

  return errors;
};

module.exports = {
  validateSignupInput,
};
