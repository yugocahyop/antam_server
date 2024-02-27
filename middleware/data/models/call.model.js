const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({

 role: String,
 name: String,
 phone: String
});

module.exports = mongoose.model("Call", AppSchema);