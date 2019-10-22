var express = require("express");

var app = express();

var handlebars = require("express3-handlebars").create({
  defaultLayout: "main"
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

// 静态文件中间件
// 使用static将文件变为静态文件目录，直接访问可将文件读取、传输到客户端
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  // res.type('text/plain');
  // res.send('hello');
  res.render("home");
});

var fortunes=['mubo','zimo','nn','kk','loli'];
app.get("/about", function(req, res) {
  var randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
  res.render("about", {fortune: randomFortune});
});

app.use(function(err, res) {
  // res.type('text/plain');
  res.status(404);
  // res.send('404 - Not Found');
  res.render("404");
});

app.use(function(err, req, res, next) {
  console.error(err.statck);
  // res.type('txt/plain');
  res.status(500);
  // res.send('500 - server error');
  res.render("500");
});

app.listen(app.get("port"), function() {
  console.log("start on" + app.get("port"));
});
