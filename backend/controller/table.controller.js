const Table = require('../model/table.model')

const addTable = async (req, res) => {
    try {
        const { name } = req.body
        const table = await Table.create({ name })
        res.status(201).json({ success: true, message: 'Table created successfully', data: table })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllTable = async (req, res) => {
    try {
        const tables = await Table.find()
        res.status(200).json({ success: true, message: 'Get all table successfully', data: tables })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!table) {
            return res.status(404).json({ success: false, message: 'Table not found' })
        }
        res.status(200).json({ success: true, message: 'Table updated successfully', data: table })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id)
        if (!table) {
            return res.status(404).json({ success: false, message: 'Table not found' })
        }
        res.status(200).json({ success: true, message: 'Table deleted successfully', data: table })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    addTable,
    getAllTable,
    updateTable,
    deleteTable
}
