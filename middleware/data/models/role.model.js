const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({
  a: String,
  b: String,
  c: String,
  d: String,
});

module.exports = mongoose.model("Role", AppSchema);