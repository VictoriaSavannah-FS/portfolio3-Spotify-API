const express = require("express");
const router = express.Router();
// import .env & Schemas
const Artist = require("../models/Artist");

// MIDDLEWARE ----

const getArtist = async (req, res, next) => {
  let artist;
  try {
    artist = await Artist.findById(req.params.id);

    // conditonals
    if (artist === null) {
      // iuf arttist does not exist/ no info
      return res.status(404).json({ message: "Artist not found" });
    }
  } catch (error) {
    //if all fails - server isseu w/ fetching
    return res.status(500).json({ message: error.message });
  }
  res.artist = artist;
  // since middleware--> next
  next();
};

// RESTful Endpoints    --- --- --- --- --- --- ---
//  GET ALL ========

router.get("/", async (req, res) => {
  // res.send("All Artists Route ---");
  try {
    const artists = await Artist.find();
    return res.status(200).json(artists);
  } catch (error) {
    // server isues
    return res.status(500).json({ message: error.message });
  }
});

// GET ONE by ID -------use middlewaree
router.get("/:id", getArtist, async (req, res) => {
  res.send(`Artist ID: ${req.params.id} ---"`);
});

// POST ------------
router.post("/", async (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genres: req.body.genres,
    popularity: req.body.popularity,
    images: req.body.images,
    followers: req.body.followers,
  });
  // logic/cnditionls for respsne
  try {
    const postArtist = await artist.save();
    // status -201 //Psot
    res.status(201).json(postArtist);
  } catch (error) {
    // all fails
    res.status(500).json({ message: error.message });
  }
});
// PATCH -----------
router.patch("/:id", getArtist, async (req, res) => {
  // res.patch(`Artist ID: ${req.params.id} --- HAS BEEN EDITED"`);
  if (req.body.name != null) {
    res.artist.name = req.body.name;
  }
  if (req.body.genres != null) {
    res.artist.genres = req.body.genres;
  }

  try {
    const editArtist = await res.artist.save();
    // status -200 //Psot
    res.status(201).json(editArtist);
  } catch (error) {
    // all fails
    res.status(500).json({ message: error.message });
  }
});
// DELETE ----------
router.delete("/:id", getArtist, async (req, res) => {
  // res.send(`Artist ID: ${req.params.id} --- Has been DELETED"`);
  try {
    const deletedArtist = await res.artist.deleteOne();
    res.status(200).json({
      message: `Artist ${deletedArtist} withh ID: ${req.body.params} was DELETED succesfully---`,
    });
  } catch (error) {
    // all fails
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
