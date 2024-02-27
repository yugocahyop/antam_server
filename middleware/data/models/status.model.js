const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 timeStamp: Number,
 status: Boolean,
 alarmArus: Boolean,
 alarmTegangan: Boolean
});

module.exports = mongoose.model("Status", AppSchema);