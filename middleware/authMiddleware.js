const express = require("express");
// import the actaul tokens from model stoerd on DB to validate authentication through the middleware
const UserToken = require("../models/UserToken");

// middleware- handles validation and logci for valid acccerss token

const authHandler = async (req, res, next) => {
  // try-cath for error handling ----
  try {
    //check for currentt access token - still valid? -- fetch most recent / current
    const validToken = await UserToken.findOne().sort({ created_at: -1 });
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
      //res.Statuis
      return res.status(401).json({ error: "Access Token is EXPIRED --- " });
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
