const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const {
    addOrder,
    getAllOrder,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require('../controller/order.controller')

const router = express.Router()

// Staff/waiter takes orders -> requires login (any role)
router.route('/')
    .post(authMiddleware, addOrder)
    .get(authMiddleware, getAllOrder)

router.route('/:id')
    .get(authMiddleware, getOrderById)
    .delete(authMiddleware, deleteOrder)

router.patch('/:id/status', authMiddleware, updateOrderStatus)

module.exports = router
