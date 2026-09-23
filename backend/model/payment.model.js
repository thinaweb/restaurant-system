const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        method: {
            type: String,
            enum: ['cash', 'aba', 'acleda', 'other'],
            default: 'cash'
        },
        paidAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
