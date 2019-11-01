var fortune = require("../lib/fortune.js");

exports.home = function(req, res) {
  res.cookie("monster", "momo");
  res.cookie("husband", "mumu", { signed: true });
  res.render("home");
};

exports.about = function(req, res) {
  req.session.husband = "mumu";
  res.render("about", {
    fortune: fortune.getFortune(),
    pageTextScript: "/qa/tests-about.js"
  });
};

