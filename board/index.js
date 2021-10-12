import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import dotenv from "dotenv";
import path from "path";
import homeRouter from "./routes/home.js";
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

// Routes
app.use("/", homeRouter);

// Port setting
const port = process.env.PORT;
app.listen(port, () => {
  console.log("server on! http://localhost:" + port);
});
