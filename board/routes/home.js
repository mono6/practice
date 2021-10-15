import passport from "../config/passport.js";
import express from "express";
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.render("home/welcome");
});
router.get("/about", (req, res) => {
  res.render("home/about");
});

//Login 2
router.get("/login", (req, res) => {
  const username = req.flash("username")[0];
  const errors = req.flash("errors")[0] || {};
  res.render("home/login", {
    username: username,
    errors: errors,
  });
});

//Psot login
router.post(
  "/login",
  (req, res, next) => {
    const errors = {};
    const isValid = true;
    if (!req.body.username) {
      isValid = false;
      errors.username = "Username is required!";
    }
    if (!req.body.password) {
      isValid = false;
      errors.password = "Password is required!";
    }
    if (isValid) {
      next();
    } else {
      req.flash("errors", errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  })
);

export default router;
