const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        table: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending'
        },
        totalPrice: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
