const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 timeStamp: Number,
 timeStamp_server:Number,
 diagnosticData: Array
});

module.exports = mongoose.model("Diagnostic", AppSchema);