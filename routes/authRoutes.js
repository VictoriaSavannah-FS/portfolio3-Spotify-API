const express = require("express");
const axios = require("axios");
require("dotenv").config();
const UserToken = require("../models/UserToken"); //stores all USers' Tokens -----

const router = express.Router();

// import/refernce vars frm .env -------------------
//take user>Spotify login page--

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

/*GET METHOD - for  /LOGIN endpoint -------------------------------------------------------------
 *Sends Userd tp Spotify Login page------
 *directs user to login eednpoint to authorizre app */

router.get("/login", (req, res) => {
  console.log("Login route -- reached ---");

  if (!CLIENT_ID && !REDIRECT_URI) {
    //checking req. env. vars available--
    console.error("Missing Spotify env. vars ---- ");
    return res
      .status(500)
      .json({ error: "Missing Spotify env. vars ------- " });
  }

  /* auth. user prfile permissons - Encodes a text string as a valid component of a UniformResource Identifier (URI).
  req.acess to user profile + email */

  const scope = encodeURIComponent("user-read-private user-read-email");
  const authUrl = `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scope}`;

  console.log("Redirecting to Spotify Login:", authUrl); // Log auth URL -----
  res.redirect(authUrl); //   redirected login endpoint w/ vars. params
});

// CALLBACK endpoiunt ----------------------------------------------------------------------

/**Exchnging Code for Access Token --
 *    Handle SPotify Res. data ---
 *    Aysnc- fetching from databse
 *    exchnge "code" for access tokens after logn  auth granted
 */

router.get("/callback", async (req, res) => {
  const code = req.query.code; //extract "code" from req.
  if (!code) {
    // condtionals to handle if NO "code" returned - 400:Bad Req. -vs 500: internal server erorr
    return res
      .status(400)
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

  try {
    console.log("Making req to Sptify API --- Acces_Token..."); //log ---

    const response = await axios.post(SPOTIFY_TOKEN_URL, authReq, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    // data returned---
    const { access_token, refresh_token, expires_in } = response.data;
    // handle if fails to return access_token
    if (!access_token) {
      console.error("ERROR -- Failed to get Access_Token from Spotify...");
      return res.status(500).json({ error: "COULD NOT get Access_Token..." });
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in); // Calculate expiration time
    // Save new $tokens to MongoDB -----------
    await UserToken.create({
      access_token,
      refresh_token,
      expires_at: expiresAt,
    });

    console.log("---- Tokens stored successfully in DB---- "); // log stats

    // redirect to frontend ---
    res.redirect(
      `${FRONTEND_URL}/profile?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (error) {
    console.error("Error EXCHANGING code:", error.message);
    res.status(500).json({ error: "Failed to get access token --- " });
  }
});

/* GET mthd FOR TOKEN REFRESH  ------------------------------------------------------------ 
    > refresh expirede tokens
    > Aysnc- fetching from databse
    > exchnge "code" for access tokens after logn nd auth granted
*/

router.get("/refresh_token", async (req, res) => {
  try {
    // fetch most recenet $token from DB ---
    const userToken = await UserToken.findOne().sort({ created_at: -1 });

    /*conditionals :
     * IF get token--> auth. Spotify API req.
     * IF !token --> refresh_token para
     */

    if (!userToken || !userToken.refresh_token) {
      console.error("No userToken found -- User needs log in again ---"); // log error---
      return res
        .status(400)
        .json({ error: "NO User Token found -- Log in again" });
    }
    // refresh Tokens ffrom acesseToken
    console.log("Refrsh access token", userToken.refresh_token);

    //Req. new AccessToekn form Spotify API - URL-PARAMS (reformats)
    const authReq = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: userToken.refresh_token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const response = await axios.post(SPOTIFY_TOKEN_URL, authReq, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    // ------ JWT ---> AcessToken res. data
    const {
      access_token,
      refresh_token: newRefreshToken,
      expires_in,
    } = response.data;

    // if NO access token ----------
    if (!access_token) {
      console.error(" Error --- Failed to refresh access token ---- ");
      return res.status(500).json({ error: "Failed to refresh access token." });
    }
    //update toekn ---
    userToken.access_token = access_token;
    userToken.expires_at = new Date(Date.now() + expires_in * 1000);

    //Update refresh token - only if New ---
    if (newRefreshToken) {
      userToken.refresh_token = newRefreshToken; //upadte
    }

    //save to DB ---
    await userToken.save();
    console.log("SUCCESS --- Access_Token refreshed");
    res.json({ access_token }); //rtned new acesee toekn sto user
    //
    //
  } catch (error) {
    console.error("Error refreshing token:", error.message); //LOG---
    res.status(500).json({ error: "Could NOT refresh access token" });
  }
});

// route to chek for stored tokens w/out middleware  ----
router.get("/tokens", async (req, res) => {
  // trycahtc blck --
  try {
    const recentToken = await UserToken.findOne().sort({ created_at: -1 });
    // chck for latest token sotred
    // erro handler --- if !token
    if (!recentToken) {
      // log--
      console.error("Error -- NO TOKENS in Dataabase ---");
      return res
        .status(404)
        .json({ message: "No tokens found in the database." });
    }

    res.json({
      access_token: recentToken.access_token,
      refresh_token: recentToken.refresh_token,
      expires_at: recentToken.expires_at,
    });
  } catch (error) {
    console.error("Error fetching token from DB:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
