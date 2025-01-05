const { google } = require('googleapis');

/**
 * Middleware to set up OAuth2 client for authenticated requests.
 */
const oauthMiddleware = (req, res, next) => {
  const { access_token, refresh_token } = req.headers; // Tokens passed in headers

  if (!access_token || !refresh_token) {
    return res.status(400).json({ error: 'Authentication tokens are missing' });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({ access_token, refresh_token });
  req.oauth2Client = oauth2Client;
  next();
};

module.exports = oauthMiddleware;
