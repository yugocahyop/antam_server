const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({
 sel : Number,
 celcius : Number,
 volt: Number,
 ampere: String,
});

module.exports = mongoose.model("SelData", AppSchema);