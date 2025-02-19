const express = require("express");
const axios = require("axios");
require("dotenv").config();
const userToken = require("../models/UserToken"); // userToken -- stores all USers' Tokens -----

const router = express.Router();

/*Docs:
> https://developer.spotify.com/documentation/web-api/tutorials/code-flow#1.-request-user-authorization
> https://developer.spotify.com/documentation/web-api/concepts/access-token
> https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
> https://github.com/spotify/web-api-examples/blob/master/authorization/authorization_code/app.js

*/
// import/refernce vars frm .env -------------------
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"; // takes user to sPotify login page
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"; // exchange endpoint ----> code --> access token
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

/*GET METHOD - for  /LOGIN endpoint ----------
          SpotifyLogin pagee------
          > directs user to login eednpoint to auuthorizre app */

router.get("/login", (req, res) => {
  console.log("Login route -- reached ---");

  // i forgot to actually check for my env Vars!! ---- facepalm....
  // verifying creds/ vars are available
  if (!CLIENT_ID || !REDIRECT_URI) {
    // log errors
    console.error("Missing Spotify env. vars ---- ");
    // res.satus coode
    return res
      .status(500)
      .json({ error: "Missing Spotify env. vars ------- " });
  }
  // authenticatign user prfile and returning auth code
  const scope = "user-read-private user-read-email"; // req. acess to user profile + email

  // redirected login endpoint ---- w/ vars. params
  const authUrl = `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
  // Log auth URL -----
  console.log("Redirecting to:", authUrl);
  res.redirect(authUrl); // Redircts user ---> Spotify login
});

// CALLBACK endpoiunt -------------------

/**Exchnging Code for Access Token --
 *    Handle SPotify Res. data ---
 *    Aysnc- fetching from databse
 *    exchnge "code" for access tokens after logn nd auth granted
 */

router.get("/callback", async (req, res) => {
  const code = req.query.code; //extract "code" from req.
  // condtionals to handle if NO "code" returned -----
  if (!code) {
    return res
      .status(400) //400:Bad Req. -vs 500: internal server erorr
      .json({ error: "Authorization code |  MISSING --- " });
  }
  //DATA req. to get a.token from Spotify API----
  const authReq = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  /*send axios.post to API endpoint to get access token------
  use "code" to req. an 'acces token' from Spotify API----
  try-cath to handler errors
   */

  try {
    const response = await axios.post(SPOTIFY_TOKEN_URL, authReq, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Save tokens to MongoDB -----------
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in); // Calculate expiration time

    await UserToken.create({
      access_token,
      refresh_token,
      expires_at: expiresAt,
    });

    res.json(response.data); //prse JSON data-> retunr to user | Acess TOken data--> user
  } catch (error) {
    console.error("Error EXHANGING code:", error.message);
    res.status(500).json({ error: "Failed to get access token" });
  }
});

/* GET mthd for token refresh -------
    > refresh expirede tokens
    > Aysnc- fetching from databse exchnge "code" for access tokens after logn nd auth granted
*/

router.get("/refresh", async (req, res) => {
  const refreshToken = req.query.refresh_token; //extrct new token

  /*conditionals :
   * IF get token--> auth. Spotify API req.
   * IF !token --> refresh_token para
   */
  if (!refreshToken) {
    return res.status(400).json({ error: "Missing | Refresh token ---- " });
  }
  // FEtch token from UserToken @ monogDB ----------

  const userToken = await UserToken.findOne({ refresh_token: refreshToken });

  // cheeck if userToken exist or !-----
  if (!userToken) {
    return res.status(400).json({ error: "Invalid refresh token" });
  }

  // data setup for req. for new refreshToken ----
  const authReq = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  /*send axios.post to API endpoint to get new access token------
  try-catch blck :
   * IF get token--> auth. Spotify API req.
   * IF !token --> refresh_token para
   */
  try {
    const response = await axios.post(SPOTIFY_TOKEN_URL, authReq, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    // ------ JWT ---> AcessToken res. data
    const { access_token, expires_in } = response.data;

    // Update stored access token ----------
    userToken.access_token = response.data.access_token;
    userToken.expires_at = new Date(Date.now() + expires_in * 1000);
    await userToken.save();
    res.json(response.data); //rtned new acesee toekn sto user
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    res.status(500).json({ error: "Could NOT refresh access token" });
  }
});

module.exports = router;
