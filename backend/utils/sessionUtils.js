function parseCookies(cookieHeader) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce((cookies, cookiePart) => {
    const [rawName, ...rawValueParts] = cookiePart.trim().split('=');

    if (!rawName) {
      return cookies;
    }

    cookies[rawName] = rawValueParts.join('=');
    return cookies;
  }, {});
}

function buildSessionCookie(sessionId) {
  return `sid=${sessionId}; Path=/; HttpOnly; SameSite=Lax`;
}

module.exports = {
  parseCookies,
  buildSessionCookie
};
