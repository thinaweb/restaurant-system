const Menu = require('../model/menu.model')

const addMenu = async (req, res) => {
    try {
        const { name, category, price, image } = req.body
        const menu = await Menu.create({ name, category, price, image })
        res.status(201).json({ success: true, message: 'Menu created successfully', data: menu })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllMenu = async (req, res) => {
    try {
        const menus = await Menu.find().populate('category', 'name')
        res.status(200).json({ success: true, message: 'Get all menu successfully', data: menus })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id).populate('category', 'name')
        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menu not found' })
        }
        res.status(200).json({ success: true, message: 'Get menu successfully', data: menu })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menu not found' })
        }
        res.status(200).json({ success: true, message: 'Menu updated successfully', data: menu })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id)
        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menu not found' })
        }
        res.status(200).json({ success: true, message: 'Menu deleted successfully', data: menu })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    addMenu,
    getAllMenu,
    getMenuById,
    updateMenu,
    deleteMenu
}
