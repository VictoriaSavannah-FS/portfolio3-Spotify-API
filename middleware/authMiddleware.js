const express = require("express");
// import the actaul tokens from model stoerd on DB to validate authentication through the middleware
const UserToken = require("../models/UserToken");
require("dotenv").config(); // .env vars <-- imported

// middleware- handles validation and logci for valid acccerss token

const authHandler = async (req, res, next) => {
  // try-cath for error handling ----
  try {
    //check for currentt access token - still valid? -- fetch most recent / current
    const validToken = await UserToken.findOne().sort({ created_at: -1 });
    // log----

    console.log("Checking for valid token ...");
    // conditonal to hdnle res.
    if (!validToken || !validToken.access_token) {
      // log errors
      console.error("Problem validating token ---- ", validToken);
      return res
        .status(401)
        .json({ error: "Could NOT validate User Token - ACCESS DENIED" });
    }
    // Checknf if EXPIRED ---------------
    if (new Date() > validToken.expires_at) {
      //logError
      console.error("Problem --- Access Token EXPIRED. Refresh --- ");
      // logg curent token
      console.log("Current refrees_token", validToken.refresh_token);
      // Errro hanlder if doesn;t exist -------
      if (!validToken.refresh_token) {
        // update res stuatus+messagre
        return res.status(401).json({ error: "---Missing refresh_token" });
      }
      // req. new token -------------------------
      const authReq = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: validToken.refresh_token, //the stordd refresh-token from mongdb
        client_id: process.env.SPOTIFY_CLIENT_ID, //corrct ref.
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      });
      // req. new toekn form spotify! -------------
      try {
        const response = await axios.post(
          process.env.SPOTIFY_TOKEN_URL,
          authReq,
          {
            headers: { "Content-type": "application/x-www-form-urlencoded" },
          }
        );
        const {
          access_token,
          refresh_token: newRefreshToken,
          expires_in,
        } = response.data;

        // UPDTING mongoDB ----
        validToken.access_token = access_token; //updte fileds
        validToken.expires_at = new Date(Date.now() + expires_in * 1000);
        await validToken.save();
        // log res..===
        console.log("Token refreshed");
        // update the new refresh toekn if given ------
        if (newRefreshToken) {
          validToken.refresh_token = newRefreshToken; //updte variabl
        }

        await validToken.save(); // udpate new updtes/changes
        console.log("Token refreshed and saved!");
        // log res.----
        console.log("Updated Token:", validToken);
      } catch (error) {
        // logError
        console.error("Error, coudln't refresh toke ---", error.message);
        //res.Statuis
        return res.status(401).json({ error: "Access Token is EXPIRED --- " });
      }
    }

    // take res. --> pass to erq. object
    req.access_token = validToken.access_token;
    // next middleware----next route
    next();
  } catch (error) {
    // clog errors
    console.error("Auth Middleware Error:", error.message);
    //eorror handler
    res.status(500).json({ error: "Internal server error in auth middleware" });
  }
};

module.exports = authHandler;
