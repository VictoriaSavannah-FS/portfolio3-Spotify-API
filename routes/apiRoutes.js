const express = require("express");
const axios = require("axios");
require("dotenv").config();
const UserToken = require("../models/UserToken"); // userToken -- stores all USers' Tokens -----
// import middleware ------------
const authHandler = require("../middleware/authMiddleware");

const router = express.Router();
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

/*TO DO: 
- create Routes to: GET MTHD
    1. Spotify PRofile 0--- /spotify/ user
    2.playlslists---- /spotify/
    3. Top Tracsk Albums

*/

//GET Users Profile ------------ will chek for Valid Acss Token
// add middleware ------
// router.get("/user", async (req, res) => {
//   // trycatch block- handle erors and status updates ----
//   try {
//     //check for currentt access token - still valid? -- fetch most recent / current
//     const validToken = await UserToken.findOne().sort({ created_at: -1 });
//     // conditonal to hdnle res.
//     if (!validToken || !validToken.access_token) {
//       // log errors
//       console.error("Problem validating token", validToken);
//       return res
//         .status(401)
//         .json({ error: "Could NOT validate User Token - ACCESS DENIED" });
//     }
//     // fetch user data from Spotify API to get user profile
//     const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me`, {
//       headers: { Authorization: `Bearer ${validToken.access_token}` },
//     });

//     res.json(response.data); // snd back res. user profile data
//   } catch (error) {
//     //    log errros
//     console.error("Error -- failed to fetch user data", error.message);
//     res.status(500).json({ error: "Failed -- could not fetch user data" });
//   }
// });
router.get("/user", authHandler, async (req, res) => {
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
router.get("/playlists", authHandler, async (req, res) => {
  // trycatch block- handle erors and status updates ----
  try {
    // fetch user data from Spotify API to get user profile
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/playlists`, {
      //   headers: { Authorization: `Bearer ${validToken.access_token}` },//update w/ correct authHandler res. value
      headers: { Authorization: `Bearer ${req.access_token}` },
    });
    res.json(response.data); // snd back res
  } catch (error) {
    //    log errros
    console.error("Error -- failed to fetch user playlists", error.message);
    res.status(500).json({ error: "Failed -- could not fetch Playlists Data" });
  }
});

// GET User TOp TRacks ------// add middleware ------
router.get("/top-tracks", authHandler, async (req, res) => {
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
