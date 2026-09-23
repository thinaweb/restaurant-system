const User = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// todo: ============ Post User ============
const addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        user.password = undefined

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Get All User ============
const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json({
            success: true,
            message: 'Get all user successfully',
            data: users
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Get User By ID ============
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.status(200).json({ success: true, message: 'Get user successfully', data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Update User ============
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password')

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({ success: true, message: 'User updated successfully', data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Delete User ============
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.status(200).json({ success: true, message: 'User deleted successfully', data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// todo: ============ Login User ============
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(200).json({
            success: true,
            message: 'Login successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    addUser,
    loginUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}
