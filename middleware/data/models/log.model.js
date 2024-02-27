const mongoose = require("mongoose");

const AppSchema = mongoose.Schema({
    user_id: String,
    ip: String,
    // mac: String,
    username: String,
    datetime: Number,
    table: String,
    data_id: String,
    data_name: String,
    value: Object,
    prev_value: String,
    activity: {
        type: String,
        Enumerator: ["create", "update", "delete", "read", "download"]
    }
});

module.exports = mongoose.model("Log", AppSchema);