// Usage: roleMiddleware('admin', 'super')
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Not authenticated'
            })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You do not have permission'
            })
        }

        next()
    }
}

// Backward-compatible default: admin + super only (used as `adminMiddleware`)
const adminMiddleware = roleMiddleware('admin', 'super')

module.exports = roleMiddleware
module.exports.adminMiddleware = adminMiddleware
