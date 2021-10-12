const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
dotenv.config();
const app = express();

// DB setting
mongoose.connect(process.env.MONGO_DB); // 1
const db = mongoose.connection; //2

db.once("open", () => {
  console.log("DB connected");
});
db.on("error", (err) => {
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// DB schema // 4
const contactSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  phone: { type: String },
});
const Contact = mongoose.model("contact", contactSchema); // 5

// Routes
// Home
app.get("/", (req, res) => {
  res.redirect("/contacts");
});
// Contacts - Index
app.get("/contacts", (req, res) => {
  Contact.find({}, (err, contacts) => {
    if (err) return res.json(err);
    res.render("contacts/index", { contacts: contacts });
  });
});
// Contacts - New
app.get("/contacts/new", (req, res) => {
  res.render("contacts/new");
});
// Contacts - create
app.post("/contacts", (req, res) => {
  Contact.create(req.body, (err, contact) => {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});

// Contacts - show
app.get("/contacts/:id", (req, res) => {
  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) return res.json(err);
    res.render("contacts/show", { contact: contact });
  });
});
// Contacts - edit
app.get("/contacts/:id/edit", (req, res) => {
  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) return res.json(err);
    res.render("contacts/edit", { contact: contact });
  });
});

// Contacts - update
app.put("/contacts/:id", (req, res) => {
  Contact.findOneAndUpdate({ _id: req.params.id }, req.body, (err, contact) => {
    if (err) return res.json(err);
    res.redirect("/contacts/" + req.params.id);
  });
});

// Contacts - destroy
app.delete("/contacts/:id", (req, res) => {
  Contact.deleteOne({ _id: req.params.id }, (err) => {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});

// Port setting
const port = process.env.PORT;
app.listen(port, () => {
  console.log("server on! http://localhost:" + port);
});
