require('dotenv').config()

const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const userRoute = require('./routes/user.route')
const categoryRoute = require('./routes/category.route')
const menuRoute = require('./routes/menu.route')
const tableRoute = require('./routes/table.route')
const orderRoute = require('./routes/order.route')
const orderDetailRoute = require('./routes/orderDetail.route')
const paymentRoute = require('./routes/payment.route')
const reportRoute = require('./routes/report.route')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/menu', menuRoute)
app.use('/api/table', tableRoute)
app.use('/api/order', orderRoute)
app.use('/api/order-detail', orderDetailRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/report', reportRoute)

// Serve the frontend dashboard (frontend/index.html) from the same server
app.use(express.static(path.join(__dirname, '../frontend')))

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('database connected')

        // Auto-create a default admin account on first run (safe: only runs if no admin exists yet)
        try {
            const User = require('./model/user.model')
            const bcrypt = require('bcryptjs')
            const existingAdmin = await User.findOne({ role: { $in: ['admin', 'super'] } })
            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash('123456', 10)
                await User.create({
                    username: 'admin',
                    email: 'admin@gmail.com',
                    password: hashedPassword,
                    role: 'super'
                })
                console.log('✅ Default admin created: admin@gmail.com / 123456 (please change password after login)')
            }
        } catch (seedError) {
            console.error('Admin auto-seed failed:', seedError.message)
        }

        app.listen(PORT, () => {
            console.log(`server running at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error('database connection failed:', error.message)
    })
