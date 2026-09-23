const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
