const { getSession } = require('../data/sessionStore');
const { parseCookies } = require('../utils/sessionUtils');

async function requireAuth(req, res, next) {
  const cookies = parseCookies(req.header('cookie'));
  const sessionId = cookies.sid;

  if (!sessionId) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  const session = await getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  req.currentUser = {
    id: session.user_id
  };

  next();
}

module.exports = {
  requireAuth
};
