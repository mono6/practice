import User from "../models/User.js";
import express from "express";
import util from "../util.js";
const router = express.Router();

// New
router.get("/new", (req, res) => {
  const user = req.flash("user")[0] || {};
  const errors = req.flash("error")[0] || {};
  console.log("errors", errors);
  res.render("users/new", { user: user, errors: errors });
});

// create
router.post("/", (req, res) => {
  User.create(req.body, (err, user) => {
    console.log(user);
    if (err) {
      req.flash("user", req.body);
      req.flash("error", util.parseError(err));
      return res.redirect("/users/new");
    }
    res.redirect("/users");
  });
});

// show
router.get("/:username", util.isLoggedin, checkPermission, (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    console.log(user);
    if (err) return res.json(err);
    res.render("users/show", { user: user });
  });
});

// edit
router.get("/:username/edit", util.isLoggedin, checkPermission, (req, res) => {
  const user = req.flash("user")[0];
  const errors = req.flash("errors")[0] || {};
  if (!user) {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) return res.json(err);
      res.render("users/edit", {
        username: req.params.username,
        user: user,
        errors: errors,
      });
    });
  } else {
    res.render("users/edit", {
      username: req.params.username,
      user: user,
      errors: errors,
    });
  }
});

// update/
router.put("/:username", util.isLoggedin, checkPermission, (req, res, next) => {
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
        if (err) {
          req.flash("user", req.body);
          req.flash("errors", util.parseError(err));
          return res.redirect("/users/" + req.params.username + "/edit");
        }
        res.redirect("/users/" + user.username);
      });
    });
});

export default router;

function checkPermission(req, res, next) {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) return res.json(err);
    if (user.id != req.user.id) return util.noPermission(req, res);
    next();
  });
}
