// setting up local server
const express = require("express");
require("dotenv").config();

const mongoose = require("mongoose");

const app = express();
// fiixng CORS isseu -----
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL, //Only frontend req. ---
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// parse json req.s
app.use(express.json());
//PROT setup    -----
const PORT = process.env.PORT || 8000; //|| heroku...

const DATABASE_URL = process.env.DATABASE_URL;

//mongoose - env. variabels ---- DATABAASE

mongoose.connect(DATABASE_URL, {
  tls: true,
});
const db = mongoose.connection;
// error log----
db.on("error", (error) => console.error(error));
// db connects --- once on connction
db.once("open", () =>
  console.log(" --- | Database Connection Established | ---")
);

// mongoose.connect("mongodb://127.0.0.1:27017/spotifyx");

// ROUTES -------------
const authRouter = require("./routes/authRoutes"); // Import authRoutes
app.use("/auth", authRouter); // use authRoutes
// User API ROUTES ----
const apiRouter = require("./routes/apiRoutes");
app.use("/spotify", apiRouter);
app.use("/", apiRouter);

// const artistRouter = require("./routes/artistRoutes");
// everytioes we go to base url --- artists
// app.use("/artists", artistRouter);

// listeners

app.listen(PORT, () => {
  console.log(
    `Server is runnig on port: ${PORT} --- Yay! We're connected ---- `
  );
});
