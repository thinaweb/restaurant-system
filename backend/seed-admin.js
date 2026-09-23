// Run once: node seed-admin.js
// Creates a default owner/admin account so you can log in for the first time.

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./model/user.model')

const DEFAULT_ADMIN = {
    username: 'admin',
    email: 'admin@gmail.com',
    password: '123456',
    role: 'super'
}

async function seed() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('database connected')

    const existing = await User.findOne({ email: DEFAULT_ADMIN.email })
    if (existing) {
        console.log('Admin already exists:', DEFAULT_ADMIN.email)
        process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10)

    await User.create({
        ...DEFAULT_ADMIN,
        password: hashedPassword
    })

    console.log('✅ Admin created!')
    console.log('   email:', DEFAULT_ADMIN.email)
    console.log('   password:', DEFAULT_ADMIN.password)
    console.log('   (please change the password after first login)')

    process.exit(0)
}

seed().catch(err => {
    console.error(err)
    process.exit(1)
})
