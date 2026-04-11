const crypto = require('crypto');

function validateUser(body) {
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return 'username, email and password are required';
  }

  if (typeof username !== 'string' || username.length < 3 || username.length > 20) {
    return 'username must be between 3 and 20 characters';
  }

  if (!/^[A-Za-z0-9._-]+$/.test(username)) {
    return 'username can only contain letters, numbers, ., _ and -';
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return 'email must have a valid format';
  }

  if (typeof password !== 'string' || password.length < 8) {
    return 'password must be at least 8 characters long';
  }

  return null;
}

function validateUserUpdate(body) {
  const { username, email } = body;

  if (!username || !email) {
    return 'username and email are required';
  }

  if (typeof username !== 'string' || username.length < 3 || username.length > 20) {
    return 'username must be between 3 and 20 characters';
  }

  if (!/^[A-Za-z0-9._-]+$/.test(username)) {
    return 'username can only contain letters, numbers, ., _ and -';
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return 'email must have a valid format';
  }

  return null;
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function validateLogin(body) {
  const { email, password } = body;

  if (!email || !password) {
    return 'email and password are required';
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return 'email must have a valid format';
  }

  if (typeof password !== 'string') {
    return 'password must be a string';
  }

  return null;
}

function buildUserFromBody(body) {
  return {
    username: body.username,
    email: body.email,
    password_hash: hashPassword(body.password)
  };
}

function buildUserResponse(user) {
  return {
    username: user.username,
    email: user.email,
  };
}

function buildUserUpdateFromBody(body) {
  return {
    username: body.username,
    email: body.email
  };
}

module.exports = {
  validateUser,
  validateUserUpdate,
  validateLogin,
  hashPassword,
  buildUserFromBody,
  buildUserUpdateFromBody,
  buildUserResponse
};
