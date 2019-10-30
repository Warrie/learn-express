var express = require("express");
var fortune = require("./lib/fortune");
var formidable = require("formidable");
var jqupload = require("jquery-file-upload-middleware");
var credentials = require("./credentials");

var app = express();

var handlebars = require("express3-handlebars").create({
  defaultLayout: "main",
  // extname: '.hbs',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

// 静态文件中间件
// 使用static将文件变为静态文件目录，直接访问可将文件读取、传输到客户端
app.use(express.static(__dirname + "/public"));

app.use(require("body-parser")());
// 根据路由判断是测试进行还是正常加载
app.use(function(req, res, next) {
  // console.log(`------11, app.get("env")------`);
  // console.log(11, app.get("env"), req);
  res.locals.showTests =
    app.get("env") !== "production" && req.query.test === "1";
  next();
});

// cookie
app.use(require("cookie-parser")(credentials.cookieSecret));

// 服务器会话内存存储
app.use(require('express-session')());

// 将数据传入上下文
app.use(function(req, res, next) {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = {
    locations: [{ name: "1", weather: "a" }, { name: "2", weather: "b" }]
  };
  next();
});

app.use("/upload", function(req, res, next) {
  var now = Date.now();
  jqupload.fileHandler({
    uploadDir: function() {
      return __dirname + "/public/uploads/" + now;
    },
    uploadUrl: function() {
      return "/uploads/" + now;
    }
  })(req, res, next);
});

app.get("/", function(req, res) {
  // res.type('text/plain');
  // res.send('hello');
  res.cookie('monster', 'momo');
  res.cookie('husband', 'mumu', {signed:true})
  res.render("home");
});

app.get("/about", function(req, res) {
  req.session.husband='mumu';
  res.render("about", {
    fortune: fortune.getFortune(),
    pageTestScript: "/qa/tests-about.js"
  });
});

app.get("/jquerytest", function(req, res) {
  console.log(`------req.session.husband------`);
  console.log(req.session.husband);
  res.render("jquerytest");
});

app.get("/tours/hood-river", function(req, res) {
  res.render("tours/hood-river");
});

app.get("/tours/request-group-rate", function(req, res) {
  res.render("tours/request-group-rate");
});

app.get("/nursery-rhyme", function(req, res) {
  res.render("nursery-rhyme");
});

app.get("/data/nursery-rhyme", function(req, res) {
  res.json({
    animal: "bbbbb"
  });
});

app.get("/contest/vacation-photo", function(req, res) {
  var now = new Date();
  res.render("contest/vacation-photo", {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post("/contest/vacation-photo/:year/:month", function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      return res.redirect(303, "/error");
    }
    console.log("receive", fields, "files", files);
    res.redirect(303, "/thank-you");
  });
});

app.get("/error", function(req, res) {
  res.render("error");
});

app.get("/thank-you", function(req, res) {
  res.render("thank-you");
});

app.use(function(err, res) {
  // res.type('text/plain');
  res.status(404);
  // res.send('404 - Not Found');
  res.render("404");
});

app.use(function(err, req, res, next) {
  console.error(err);
  // res.type('txt/plain');
  res.status(500);
  // res.send('500 - server error');
  res.render("500");
});

app.listen(app.get("port"), function() {
  console.log("start on" + app.get("port"));
});
