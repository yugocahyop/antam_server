const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({
 timeStamp_server: Number,
 timeStamp: Number,
 totalWaktu: Number,
 teganganTotal: Number,
 arusTotal: Number,
 power: Number,
 energi: Number,
});

module.exports = mongoose.model("Statistic", AppSchema);