// validation.js

// Sample user data (in-memory for this example)
const users = {};

// Validate if the email is unique
const isEmailUnique = (email) => {
  return !users[email];
};

// Basic input validation
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

  const errors = [];

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

  if (!isEmailUnique(email)) {
    errors.push('Email is already registered.');
  }

  return errors;
};

module.exports = {
  validateSignupInput,
};
