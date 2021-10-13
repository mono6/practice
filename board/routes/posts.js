import Post from "../models/post.js";
import express from "express";
const router = express.Router();

// Index
router.get("/", (req, res) => {
  Post.find({})
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) return res.json(err);
      res.render("posts/index", { posts: posts });
    });
});

// New
router.get("/new", (req, res) => {
  res.render("posts/new");
});

// create
router.post("/", (req, res) => {
  Post.create(req.body, (err, post) => {
    if (err) return res.json(err);
    res.redirect("/posts");
  });
});

// show
router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) return res.json(err);
    res.render("posts/show", { post: post });
  });
});

// edit
router.get("/:id/edit", (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) return res.json(err);
    res.render("posts/edit", { post: post });
  });
});

// update
router.put("/:id", (req, res) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, (err, post) => {
    if (err) return res.json(err);
    res.redirect("/posts");
  });
});

// destroy
router.delete("/:id", (req, res) => {
  Post.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err) return res.json(err);
    res.redirect("/posts");
  });
});

export default router;
