const Category = require('../model/category.model')

const addCategory = async (req, res) => {
    try {
        const { name } = req.body
        const category = await Category.create({ name })
        res.status(201).json({ success: true, message: 'Category created successfully', data: category })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({ success: true, message: 'Get all category successfully', data: categories })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' })
        }
        res.status(200).json({ success: true, message: 'Category updated successfully', data: category })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' })
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully', data: category })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    addCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}
