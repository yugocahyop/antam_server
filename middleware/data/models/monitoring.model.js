const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 timeStamp: Number,
 timeStamp_server:Number,
 tangkiData: Array
});

module.exports = mongoose.model("Monitoring", AppSchema);