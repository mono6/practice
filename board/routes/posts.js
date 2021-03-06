import Post from "../models/Post.js";
import express from "express";
import util from "../util.js";
import User from "../models/User.js";
const router = express.Router();

// Index
router.get("/", async (req, res) => {
  // parseInt : 쿼리스트링은 문자열로 전달되기 때문에 숫자가 아닐수도있고, 정수를 읽어내기 위해
  //Math.max : page,limit은 양수여야 하기때문 최소 1이 되어야함

  let page = Math.max(1, parseInt(req.query.page));
  let limit = Math.max(1, parseInt(req.query.limit));
  page = !isNaN(page) ? page : 1;
  limit = !isNaN(limit) ? limit : 5;

  const skip = (page - 1) * limit;
  let maxPage = 0;
  let searchQuery = await createSearchQuery(req.query);
  let posts = [];

  if (searchQuery) {
    let count = await Post.countDocuments(searchQuery);
    maxPage = Math.ceil(count / limit);
    posts = await Post.find(searchQuery)
      .populate("author")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .exec();
  }
  res.render("posts/index", {
    posts: posts,
    currentPage: page,
    maxPage: maxPage,
    limit: limit,
    searchType: req.query.searchType,
    searchText: req.query.searchText,
  });
});

// New
router.get("/new", util.isLoggedin, (req, res) => {
  const post = req.flash("post")[0] || {};
  const errors = req.flash("error")[0] || {};
  console.log("errors", errors);
  res.render("posts/new", { post: post, errors: errors });
});

// create
router.post("/", util.isLoggedin, (req, res) => {
  req.body.author = req.user._id;
  Post.create(req.body, (err, post) => {
    if (err) {
      req.flash("post", req.body);
      req.flash("error", util.parseError(err));
      return res.redirect("/posts/new" + res.locals.getPostQueryString());
    }
    res.redirect(
      "/posts" +
        res.locals.getPostQueryString(false, { page: 1, searchText: "" })
    );
  });
});

// show
router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("author")
    .exec((err, post) => {
      if (err) return res.json(err);
      res.render("posts/show", { post: post });
    });
});

// edit
router.get("/:id/edit", util.isLoggedin, checkPermission, (req, res) => {
  const post = req.flash("post")[0];
  const errors = req.flash("errors")[0] || {};
  if (!post) {
    Post.findOne({ _id: req.params.id }, (err, post) => {
      if (err) return res.json(err);
      res.render("posts/edit", { post: post });
    });
  } else {
    post._id = req.params.id;
    res.render("posts/edit", { post: post, errors: errors });
  }
});

// update
router.put("/:id", util.isLoggedin, checkPermission, (req, res) => {
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { runValidators: true },
    (err, post) => {
      if (err) {
        req.flash("post", req.body);
        req.flash("errors", util.parseError(err));
        return res.redirect(
          "/posts/" + req.params.id + "/edit" + res.locals.getPostQueryString()
        );
      }
      res.redirect("/posts/" + req.params.id + res.locals.getPostQueryString());
    }
  );
});

// destroy
router.delete("/:id", util.isLoggedin, checkPermission, (req, res) => {
  Post.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err) return res.json(err);
    res.redirect("/posts" + res.locals.getPostQueryString());
  });
});

export default router;

// author와 로그인된 id비교 다르면 noPermission함수 호출
function checkPermission(req, res, next) {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) return res.json(err);
    if (post.author != req.user.id) return util.noPermission(req, res);
    next();
  });
}

async function createSearchQuery(queries) {
  let searchQuery = {};
  if (
    queries.searchType &&
    queries.searchText &&
    queries.searchText.length >= 3
  ) {
    let searchTypes = queries.searchType.toLowerCase().split(",");
    let postQueries = [];
    if (searchTypes.indexOf("title") >= 0) {
      postQueries.push({
        title: { $regex: new RegExp(queries.searchText, "i") },
      });
    }
    if (searchTypes.indexOf("body") >= 0) {
      postQueries.push({
        body: { $regex: new RegExp(queries.searchText, "i") },
      });
    }
    if (searchTypes.indexOf("author!") >= 0) {
      let user = await User.findOne({ username: queries.searchText }).exec();
      if (user) postQueries.push({ author: user._id });
    } else if (searchTypes.indexOf("author") >= 0) {
      let users = await User.find({
        username: { $regex: new Reg(queries.searchText, "i") },
      }).exec();
      let userIds = [];
      for (let user of users) {
        userIds.push(user._id);
      }
      if (userIds.length > 0) postQueries.push({ author: { $in: userIds } });
    }
    if (postQueries.length > 0) searchQuery = { $or: postQueries };
    else searchQuery = null;
  }
  return searchQuery;
}
