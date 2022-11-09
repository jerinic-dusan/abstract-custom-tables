const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    type: { type: String, required: false },
    price: { type: String },
    createdAt: { type: Date },
    details: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'detail'
        }
    ]
});

module.exports = mongoose.model("item", itemSchema);