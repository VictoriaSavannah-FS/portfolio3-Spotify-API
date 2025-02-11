const mongoose = require("mongoose");

// create a schema for images - artists/ albums

const imgSchema = new mongoose.Schema({
  /* Refernce
    "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      "height": 300,
      "width": 300*/
  url: {
    type: String,
  },
  height: {
    type: Number,
  },
  width: {
    type: Number,
  },
});

// Artist Schema -----

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genres: {
    type: [String], //b/c spotify returns arrays
    required: true,
  },
  popularity: {
    type: Number,
    required: true,
  },
  followers: {
    type: Number,
    require: true,
    default: 0, //sets a default #
  },
  images: [imgSchema], //use img model from above
  id: { type: String, required: true },
  type: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Artist", artistSchema);

/*Response sample from Spotify: https://developer.spotify.com/documentation/web-api/reference/get-an-artist
{
  "external_urls": {
    "spotify": "string"
  },
  "followers": {
    "href": "string",
    "total": 0
  },
  "genres": ["Prog rock", "Grunge"],
  "href": "string",
  "id": "string",
  "images": [
    {
      "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      "height": 300,
      "width": 300
    }
  ],
  "name": "string",
  "popularity": 0,
  "type": "artist",
  "uri": "string"
}*/
