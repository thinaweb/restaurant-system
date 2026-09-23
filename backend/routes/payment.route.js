const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const {
    addPayment,
    getAllPayment,
    getPaymentById
} = require('../controller/payment.controller')

const router = express.Router()

router.route('/')
    .post(authMiddleware, addPayment)
    .get(authMiddleware, getAllPayment)

router.get('/:id', authMiddleware, getPaymentById)

module.exports = router
