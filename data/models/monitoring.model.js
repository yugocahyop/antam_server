const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 timeStamp: Number,
 tangkiData: Array
});

module.exports = mongoose.model("Monitoring", AppSchema);