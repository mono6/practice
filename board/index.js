import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import dotenv from "dotenv";
import path from "path";
import flash from "connect-flash";
import session from "express-session";

import passport from "./config/passport.js";
import homeRouter from "./routes/home.js";
import postsRouter from "./routes/posts.js";
import userRouter from "./routes/users.js";
import util from "./util.js";
const __dirname = path.resolve();
const app = express();
dotenv.config();

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
app.use(flash());
app.use(session({ secret: "MySecret", resave: true, saveUninitialized: true }));

//Passoprt //2
app.use(passport.initialize());
app.use(passport.session());

//Custom Middlewares//3
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/", homeRouter);
app.use("/posts", util.getPostQueryString, postsRouter);
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send("일치하는 주소가 없습니다!");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("서버 에러!"); // 500 상태 표시 후 에러 메시지 전송
});
// Port setting
const port = process.env.PORT;
app.listen(port, () => {
  console.log("server on! http://localhost:" + port);
});
