const mongoose = require("mongoose");
const { NUMBER } = require("oracledb");

const AppSchema = mongoose.Schema({

    teganganAtas: Number,arusBawah: Number,arusAtas : Number,suhuBawah: Number,suhuAtas : Number,phBawah : Number,phAtas: Number
});

module.exports = mongoose.model("Setting", AppSchema);