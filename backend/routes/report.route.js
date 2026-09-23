const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const { getDailyReport } = require('../controller/report.controller')

const router = express.Router()

// Owner (admin/super) only
router.get('/daily', authMiddleware, roleMiddleware('admin', 'super'), getDailyReport)

module.exports = router
