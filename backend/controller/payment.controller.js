const Payment = require('../model/payment.model')
const Order = require('../model/order.model')

// todo: ============ Create Payment (also marks order completed) ============
const addPayment = async (req, res) => {
    try {
        const { order, amount, method } = req.body

        const orderDoc = await Order.findById(order)
        if (!orderDoc) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        const payment = await Payment.create({ order, amount, method })

        orderDoc.status = 'completed'
        await orderDoc.save()

        res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllPayment = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order').sort({ createdAt: -1 })
        res.status(200).json({ success: true, message: 'Get all payment successfully', data: payments })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('order')
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' })
        }
        res.status(200).json({ success: true, message: 'Get payment successfully', data: payment })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    addPayment,
    getAllPayment,
    getPaymentById
}
