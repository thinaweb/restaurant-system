const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ['empty', 'occupied', 'reserved'],
            default: 'empty'
        }
    },
    {
        timestamps: true
    }
)

const Table = mongoose.model('Table', tableSchema)

module.exports = Table
