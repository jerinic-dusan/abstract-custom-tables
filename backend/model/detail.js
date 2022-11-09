const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: false }
});

module.exports = mongoose.model("detail", detailSchema);