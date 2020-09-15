const express = require("express");
const router = express.Router();
const Post = require("../Schemas/post");
const { authentcateToken } = require("../helper");
//
// // Get all documents
router.get("/", async (req, res) => {
  let posts = await Post.find({});
  res.status(200).json(posts);
});

router.get("/my", authentcateToken, async (req, res) => {
  console.log(req.user);
  let posts = await Post.find({ autheur: req.user._id });
  res.status(200).json(posts);
});

// Get document by ID
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let post = await Post.findOne({ _id: id }).catch(() => {
    res.status(404).json({ message: "Post not found" });
  });
  res.status(200).json({ message: "Success", data: post });
});

// Add new document
router.post("/", authentcateToken, async (req, res) => {
  let newPost = new Post({
    autheur: req.user._id,
    post: req.body.post,
    date: new Date(),
  });

  await newPost.save();

  res.status(201).json({
    message: "Created",
    data: newPost,
  });
});

// Update existing document
router.patch("/:id", authentcateToken, async (req, res) => {
  let id = req.params.id;
  let post = await Post.findOne({ _id: id }).catch(() => {
    res.status(404).send();
  });
  if (post.autheur != req.user._id.toString())
    return res.status(403).send();
  if (!req.body.post) return res.status(422).send();
  post.post = req.body.post;
  post.date = new Date();
  post
    .save()
    .then((resultat) => {
      res.status(201).json({
        message: "updated",
        data: post,
      });
    })
    .catch((err) => {
      res.status(500).send();
    });
});

// Delete document
router.delete("/:id", authentcateToken, async (req, res) => {
  let id = req.params.id;
  let post = await Post.findOne({ _id: id })
  if (!post)  res.status(404).send()
  if (post.autheur != req.user._id.toString())
    return res.status(403).send();
  await post.delete();
  res.status(204).json({
    message: "deleted",
    data: post,
  });
});

module.exports = router;
