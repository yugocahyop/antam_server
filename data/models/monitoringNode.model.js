const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 timeStamp: Number,
 tangki: Number,
 sel: Number,
 selData: Object
});

module.exports = mongoose.model("MonitoringNode", AppSchema);