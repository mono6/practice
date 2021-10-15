const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
app.set("view engine", "ejs");
app.use(
  session({ secret: "MySecret", resave: false, saveUninitialized: true })
);

// Passport setting
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/main"));
app.use("/auth", require("./routes/auth"));

// Port setting
const port = process.env.PORT;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
