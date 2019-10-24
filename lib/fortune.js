var fortunes = ["mubo", "zimo", "nn", "kk", "loli"];

exports.getFortune = function() {
  var idx = Math.floor(Math.random() * fortunes.length);
  return fortunes[idx];
};
