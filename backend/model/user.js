const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String },
    password: { type: String },
    token: { type: String },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "item"
        }
    ]
});

module.exports = mongoose.model("user", userSchema);