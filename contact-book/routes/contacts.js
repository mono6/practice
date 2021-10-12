const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Contacts - Index
router.get("/", (req, res) => {
  Contact.find({}, (err, contacts) => {
    if (err) return res.json(err);
    res.render("contacts/index", { contacts: contacts });
  });
});
// Contacts - New
router.get("/new", (req, res) => {
  res.render("contacts/new");
});
// Contacts - create
router.post("/", (req, res) => {
  Contact.create(req.body, (err, contact) => {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});

// Contacts - show
router.get("/:id", (req, res) => {
  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) return res.json(err);
    res.render("contacts/show", { contact: contact });
  });
});
// Contacts - edit
router.get("/:id/edit", (req, res) => {
  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) return res.json(err);
    res.render("contacts/edit", { contact: contact });
  });
});

// Contacts - update
router.put("/:id", (req, res) => {
  Contact.findOneAndUpdate({ _id: req.params.id }, req.body, (err, contact) => {
    if (err) return res.json(err);
    res.redirect("/contacts/" + req.params.id);
  });
});

// Contacts - destroy
router.delete("/:id", (req, res) => {
  Contact.deleteOne({ _id: req.params.id }, (err) => {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});
module.exports = router;
