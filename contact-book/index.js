const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// DB setting
mongoose.connect(process.env.MONGO_DB); // 1
const db = mongoose.connection; //2
//3
db.once("open", function () {
  console.log("DB connected");
});
//4
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Port setting
const port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
