// Stores user's Token e/a session ----------

const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserToken", UserTokenSchema);
