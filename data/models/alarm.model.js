const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 node: Number,
 timeStamp_server:Number,
 timeStamp: Number,
 tangki: Number,
 status: String,
//  listTegangan: Array,
//  listArus: Array,
//  value: Object,
//  diagnosticData: Array
});

module.exports = mongoose.model("Alarm", AppSchema);