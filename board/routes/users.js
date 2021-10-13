import User from "../models/User.js";
import express from "express";
const router = express.Router();

// Index//1
router.get("/", (req, res) => {
  User.find({})
    .sort({ username: 1 })
    .exec((err, users) => {
      if (err) return res.json(err);
      res.render("users/index", { users: users });
    });
});

// New
router.get("/new", (req, res) => {
  res.render("users/new");
});

// create
router.post("/", (req, res) => {
  User.create(req.body, (err, user) => {
    console.log(user);
    if (err) return res.json(err);
    res.redirect("/users");
  });
});

// show
router.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    console.log(user);
    if (err) return res.json(err);
    res.render("users/show", { user: user });
  });
});

// edit
router.get("/:username/edit", (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) return res.json(err);
    res.render("users/edit", { user: user });
  });
});

// update//2
router.put("/:username", (req, res, next) => {
  User.findOne({ username: req.params.username })
    .select("password") // 항목이름앞에 - 붙이면 안읽어옴 ex ) ('-password name')
    .exec((err, user) => {
      if (err) return res.json(err);

      user.originalPassword = user.password;
      user.password = req.body.newPassword
        ? req.body.newPassword
        : user.password;
      for (const p in req.body) {
        user[p] = req.body[p];
      }
      user.save((err, user) => {
        console.log(user);
        if (err) return res.json(err);
        res.redirect("/users/" + user.username);
      });
    });
});

// destory
router.delete("/:username", (req, res) => {
  User.deleteOne({ username: req.params.username }, (err) => {
    if (err) return res.json(err);
    res.redirect("/users");
  });
});

export default router;
