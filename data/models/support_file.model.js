const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({
  name: String,
  category: {
    type: String,
    Enumerator: ["manual", "literasi", "application"]
  },
  deskripsi: String,
  versi: String,
  datetime: Number,
  jenis: String,
  url: String
});

module.exports = mongoose.model("Support_file", AppSchema);