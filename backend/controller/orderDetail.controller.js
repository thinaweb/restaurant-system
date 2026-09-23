const OrderDetail = require('../model/orderDetail.model')
const Order = require('../model/order.model')

const getOrderDetailsByOrder = async (req, res) => {
    try {
        const details = await OrderDetail.find({ order: req.params.orderId }).populate('menu', 'name price image')
        res.status(200).json({ success: true, message: 'Get order details successfully', data: details })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateOrderDetail = async (req, res) => {
    try {
        const { quantity } = req.body

        const detail = await OrderDetail.findById(req.params.id).populate('menu', 'price')
        if (!detail) {
            return res.status(404).json({ success: false, message: 'Order detail not found' })
        }

        const newPrice = detail.menu.price * quantity
        const priceDiff = newPrice - detail.price

        detail.quantity = quantity
        detail.price = newPrice
        await detail.save()

        // keep order.totalPrice in sync
        await Order.findByIdAndUpdate(detail.order, { $inc: { totalPrice: priceDiff } })

        res.status(200).json({ success: true, message: 'Order detail updated successfully', data: detail })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteOrderDetail = async (req, res) => {
    try {
        const detail = await OrderDetail.findByIdAndDelete(req.params.id)
        if (!detail) {
            return res.status(404).json({ success: false, message: 'Order detail not found' })
        }
        await Order.findByIdAndUpdate(detail.order, { $inc: { totalPrice: -detail.price } })
        res.status(200).json({ success: true, message: 'Order detail deleted successfully', data: detail })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    getOrderDetailsByOrder,
    updateOrderDetail,
    deleteOrderDetail
}
