const express = require("express");
const axios = require("axios");
require("dotenv").config();
const UserToken = require("../models/UserToken"); // userToken -- stores all USers' Tokens -----
// import middleware ------------
const authHandler = require("../middleware/authMiddleware");

const router = express.Router();
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Login w/ spotfy--> redirects users to login Page

router.get("/auth/login", (req, res) => {
  console.log("Login route: Spotify endpoint!");

  if (!CLIENT_ID || !REDIRECT_URI) {
    return res.status(500).json({ error: "Missing Spotify env. vars" });
  }
  // othr params
  const scope = "user-read-private user-read-email";
  const authUrl = `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scope}`;

  // console.log("created new Auth URL:", authUrl);

  // // no redirecting-->  returnz  URL
  // res.json({ url: authUrl });
  // Yes--> to directing! Loign PAPge----
  console.log("Redirecting to:", authUrl);
  // send user to logiin login pape
  res.redirect(authUrl);
});

/*TO DO: 
- create Routes to: GET MTHD
    1. Spotify PRofile 0--- /spotify/ user
    2.playlslists---- /spotify/
    3. Top Tracsk Albums

*/

router.get("/spotify/user", authHandler, async (req, res) => {
  // trycatch block- handle erors and status updates ----
  try {
    // fetch user data from Spotify API to get user profile
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${req.access_token}` },
    });
    res.json(response.data); // snd back res. user profile data
  } catch (error) {
    //    log errros
    console.error("Error -- failed to fetch user data", error.message);
    res.status(500).json({ error: "Failed -- could not fetch user data" });
  }
});

// GET USER PLAYLISTS --// add middleware ------
router.get("/spotify/playlists", authHandler, async (req, res) => {
  // trycatch block- handle erors and status updates ----
  try {
    // fetch user data from Spotify API to get user profile
    const response = await axios.get(
      `${SPOTIFY_API_BASE_URL}/me/playlists?limit=5`,
      {
        //   headers: { Authorization: `Bearer ${validToken.access_token}` },//update w/ correct authHandler res. value
        headers: { Authorization: `Bearer ${req.access_token}` },
      }
    );
    res.json(response.data); // snd back res
  } catch (error) {
    //    log errros
    console.error("Error -- failed to fetch user playlists", error.message);
    res.status(500).json({ error: "Failed -- could not fetch Playlists Data" });
  }
});

// GET User TOp TRacks ------// add middleware ------
router.get("/spotify/top-tracks", authHandler, async (req, res) => {
  // trycatch block- handle erors and status updates ----
  try {
    // fetch user data from Spotify API to get user profile
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/top/tracks`, {
      //   headers: { Authorization: `Bearer ${validToken.access_token}` },update with authHandler res.req...
      headers: { Authorization: `Bearer ${req.access_token}` },
    });

    res.json(response.data); // snd back res. w/
  } catch (error) {
    //    log errros
    console.error("Error -- failed to fetch User top tracks", error.message);
    res.status(500).json({
      error: "Failed -- could not fetch Users' Top Tracks Data",
    });
  }
});

module.exports = router;
