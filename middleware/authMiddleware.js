// middleware- handles validation and logci for valid acccerss token
const express = require("express");
const axios = require("axios");
const UserToken = require("../models/UserToken"); //import tokens from model
require("dotenv").config(); // .env vars <-- imported

const authHandler = async (req, res, next) => {
  try {
    //fethces recent stored token --- dB
    const validToken = await UserToken.findOne().sort({ created_at: -1 });
    console.log("Checking for valid token..."); // log----

    // check for Valid tokekn ---
    if (!validToken || !validToken.access_token) {
      console.error(
        "Problem validating token ---- NO VALID TOKEN --- LOG IN NEEEDED... ",
        validToken
      ); // log----
      return res
        .status(401)
        .json({ error: "Could NOT validate User Token - ACCESS DENIED" });
    }

    //Check Token Expiration -------------------
    if (new Date() >= new Date(validToken.expires_at)) {
      console.error("Problem --- Access Token EXPIRED --- "); //logError--
      console.log("Current refresh_token", validToken.refresh_token); // log curent token --
      return res
        .status(401)
        .json({ error: "Access token expired. Please refresh." });
    }

    // take res. --> pass to erq. object

    req.access_token = validToken.access_token;
    // next middleware----next route
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message); // log errors --
    res.status(500).json({ error: "Internal server error in auth middleware" });
  }
};
module.exports = authHandler;
