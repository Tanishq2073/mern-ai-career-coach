const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateRegisterInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return "Name, email, and password are required";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return null;
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

const validateJobInput = ({ company, role }) => {
  if (!company || !role) {
    return "Company and role are required";
  }

  return null;
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateJobInput,
};