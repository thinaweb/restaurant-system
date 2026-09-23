const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const {
    addMenu,
    getAllMenu,
    getMenuById,
    updateMenu,
    deleteMenu
} = require('../controller/menu.controller')

const router = express.Router()

router.route('/')
    .post(authMiddleware, roleMiddleware('admin', 'super'), addMenu)
    .get(getAllMenu) // public so staff/customers can browse menu

router.route('/:id')
    .get(getMenuById)
    .patch(authMiddleware, roleMiddleware('admin', 'super'), updateMenu)
    .delete(authMiddleware, roleMiddleware('admin', 'super'), deleteMenu)

module.exports = router
