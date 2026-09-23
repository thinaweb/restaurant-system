const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const {
    getOrderDetailsByOrder,
    updateOrderDetail,
    deleteOrderDetail
} = require('../controller/orderDetail.controller')

const router = express.Router()

router.get('/order/:orderId', authMiddleware, getOrderDetailsByOrder)
router.patch('/:id', authMiddleware, updateOrderDetail)
router.delete('/:id', authMiddleware, deleteOrderDetail)

module.exports = router
