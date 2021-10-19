const util = {};

util.parseError = (errors) => {
  const parsed = {};
  if (errors.name == "ValidationError") {
    for (const name in errors.errors) {
      const validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
    parsed.username = { message: "This username already exists!" };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};
util.isLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("errors", { login: "로그인 먼저 하세유" });
    res.redirect("/login");
  }
};
util.noPermission = (req, res) => {
  req.flash("errors", { login: "권한이 없다" });
  req.logout();
  req.redirect("/login");
};
export default util;
