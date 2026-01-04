const mongoose = require("mongoose")


const reptSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
});

const Test = mongoose.model("Test", reptSchema);

module.exports = {Test, reptSchema}
