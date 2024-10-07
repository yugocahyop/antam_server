const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 timeStamp: Number,
 timeStamp_server:Number,
 tangkiData: Array,
 isStart: Boolean,
//  isStop: Boolean,
});

module.exports = mongoose.model("Monitoring", AppSchema);