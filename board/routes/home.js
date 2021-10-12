import express from "express";
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.render("home/welcome");
});
router.get("/about", (req, res) => {
  res.render("home/about");
});

export default router;
