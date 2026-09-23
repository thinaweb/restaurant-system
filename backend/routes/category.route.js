const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const {
    addCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
} = require('../controller/category.controller')

const router = express.Router()

router.route('/')
    .post(authMiddleware, roleMiddleware('admin', 'super'), addCategory)
    .get(getAllCategory) // public so menu screens can load categories

router.route('/:id')
    .patch(authMiddleware, roleMiddleware('admin', 'super'), updateCategory)
    .delete(authMiddleware, roleMiddleware('admin', 'super'), deleteCategory)

module.exports = router
