const mongoose = require('mongoose')

const orderDetailSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema)

module.exports = OrderDetail
