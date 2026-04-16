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
  const { username, email, hr_rest, hr_max } = body;

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

  const hasHrRest = hr_rest !== undefined && hr_rest !== null && hr_rest !== '';
  const hasHrMax = hr_max !== undefined && hr_max !== null && hr_max !== '';

  if (hasHrRest !== hasHrMax) {
    return 'hr_rest and hr_max must both be provided';
  }

  if (hasHrRest && hasHrMax) {
    const parsedHrRest = Number(hr_rest);
    const parsedHrMax = Number(hr_max);

    if (!Number.isInteger(parsedHrRest) || parsedHrRest <= 0) {
      return 'hr_rest must be a positive integer';
    }

    if (!Number.isInteger(parsedHrMax) || parsedHrMax <= 0) {
      return 'hr_max must be a positive integer';
    }

    if (parsedHrRest >= parsedHrMax) {
      return 'hr_rest must be lower than hr_max';
    }
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
    hr_rest: user.hr_rest,
    hr_max: user.hr_max,
  };
}

function buildUserUpdateFromBody(body) {
  const hasHrRest = body.hr_rest !== undefined && body.hr_rest !== null && body.hr_rest !== '';
  const hasHrMax = body.hr_max !== undefined && body.hr_max !== null && body.hr_max !== '';

  return {
    username: body.username.trim(),
    email: body.email.trim(),
    hr_rest: hasHrRest ? Number(body.hr_rest) : null,
    hr_max: hasHrMax ? Number(body.hr_max) : null
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
