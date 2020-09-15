const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  autheur: { type: mongoose.ObjectId },
  date: { type: String },
  post: { type: String },
});

module.exports = mongoose.model("post", postSchema);
