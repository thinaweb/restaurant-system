const Order = require('../model/order.model')
const OrderDetail = require('../model/orderDetail.model')
const Menu = require('../model/menu.model')

// todo: ============ Create Order (with items) ============
// body: { table: "Table 1", items: [{ menu: "<menuId>", quantity: 2 }, ...] }
const addOrder = async (req, res) => {
    try {
        const { table, items } = req.body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must have at least one item' })
        }

        // Fetch menu prices to make sure price is always correct (never trust client price)
        const menuIds = items.map(item => item.menu)
        const menus = await Menu.find({ _id: { $in: menuIds } })

        let totalPrice = 0
        const detailDocs = []

        for (const item of items) {
            const menu = menus.find(m => m._id.toString() === item.menu)
            if (!menu) {
                return res.status(404).json({ success: false, message: `Menu item not found: ${item.menu}` })
            }
            const lineTotal = menu.price * item.quantity
            totalPrice += lineTotal
            detailDocs.push({
                menu: menu._id,
                quantity: item.quantity,
                price: lineTotal
            })
        }

        const order = await Order.create({
            table,
            totalPrice,
            status: 'pending'
        })

        const orderDetails = await OrderDetail.insertMany(
            detailDocs.map(d => ({ ...d, order: order._id }))
        )

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { order, items: orderDetails }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Get All Orders ============
const getAllOrder = async (req, res) => {
    try {
        const { status } = req.query
        const filter = status ? { status } : {}
        const orders = await Order.find(filter).sort({ createdAt: -1 })
        res.status(200).json({ success: true, message: 'Get all order successfully', data: orders })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Get Order By ID (with items) ============
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        const items = await OrderDetail.find({ order: order._id }).populate('menu', 'name price image')

        res.status(200).json({ success: true, message: 'Get order successfully', data: { order, items } })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Update Order Status ============
// body: { status: "confirmed" | "completed" | "cancelled" }
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }
        res.status(200).json({ success: true, message: 'Order status updated successfully', data: order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Delete Order ============
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }
        await OrderDetail.deleteMany({ order: order._id })
        res.status(200).json({ success: true, message: 'Order deleted successfully', data: order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    addOrder,
    getAllOrder,
    getOrderById,
    updateOrderStatus,
    deleteOrder
}
