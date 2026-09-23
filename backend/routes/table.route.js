const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const {
    addTable,
    getAllTable,
    updateTable,
    deleteTable
} = require('../controller/table.controller')

const router = express.Router()

router.route('/')
    .post(authMiddleware, roleMiddleware('admin', 'super'), addTable)
    .get(authMiddleware, getAllTable)

router.route('/:id')
    .patch(authMiddleware, updateTable)
    .delete(authMiddleware, roleMiddleware('admin', 'super'), deleteTable)

module.exports = router
