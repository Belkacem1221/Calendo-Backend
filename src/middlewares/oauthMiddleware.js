const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Middleware to set up OAuth2 client for authenticated requests and handle token expiration.
 */
const oauthMiddleware = async (req, res, next) => {
  const { access_token, refresh_token } = req.headers; // Tokens passed in headers

  if (!access_token || !refresh_token) {
    return res.status(400).json({ error: 'Authentication tokens are missing' });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set credentials with access and refresh tokens
  oauth2Client.setCredentials({ access_token, refresh_token });

  try {
    // Check if the access token is still valid by requesting a new one
    const tokenInfo = await oauth2Client.getTokenInfo(access_token);

    // If the access token is expired, try to refresh it
    if (tokenInfo.expiry_date <= Date.now()) {
      console.log('Access token expired, refreshing...');

      const { tokens } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(tokens); // Update with new tokens
    }

    // Attach the oauth2Client to the request object
    req.oauth2Client = oauth2Client;
    next();
  } catch (error) {
    console.error('Error with OAuth2 client:', error);
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
};

module.exports = oauthMiddleware;
