const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({
   
    password: String,
    // passwordCon: String,
    email: String,
    active: {
        type: Boolean,
        default: false
    },
    activeToken: String,
    tokenExpire: String,
    // role: String,
   phone: String,
});

module.exports = mongoose.model("Account", AppSchema);