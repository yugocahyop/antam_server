const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 timeStamp: Number,
 timeStamp_server:Number,
 diagnosticData: Array,
 listAlarmArus: Array,
 listAlarmTegangan: Array
});

module.exports = mongoose.model("Diagnostic", AppSchema);