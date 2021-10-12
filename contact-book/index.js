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

// Routes
app.use("/", require("./routes/home.js"));
app.use("/contacts", require("./routes/contacts"));

// Port setting
const port = process.env.PORT;
app.listen(port, () => {
  console.log("server on! http://localhost:" + port);
});
