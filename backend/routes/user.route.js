const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const {
    addUser,
    loginUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../controller/user.controller')

const router = express.Router()

// Create User -> Admin only
router.route('/')
    .post(authMiddleware, roleMiddleware('admin', 'super'), addUser)
    .get(authMiddleware, roleMiddleware('admin', 'super'), getAllUser)

// Login -> Public
router.post('/login', loginUser)

// User by ID
router.route('/:id')
    .get(authMiddleware, getUserById)
    .patch(authMiddleware, roleMiddleware('admin', 'super'), updateUser)
    .delete(authMiddleware, roleMiddleware('admin', 'super'), deleteUser)

module.exports = router
