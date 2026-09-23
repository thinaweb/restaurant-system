const Order = require('../model/order.model')
const OrderDetail = require('../model/orderDetail.model')

// helper: get start & end of a given date (defaults to today), server local time
const getDayRange = (dateStr) => {
    const base = dateStr ? new Date(dateStr) : new Date()

    const start = new Date(base)
    start.setHours(0, 0, 0, 0)

    const end = new Date(base)
    end.setHours(23, 59, 59, 999)

    return { start, end }
}

// todo: ============ Daily Sales Report ============
// query: ?date=2026-09-22 (optional, defaults to today)
const getDailyReport = async (req, res) => {
    try {
        const { start, end } = getDayRange(req.query.date)

        // 1) Total revenue + total orders today (completed orders only)
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                    totalOrders: { $sum: 1 }
                }
            }
        ])

        const totalRevenue = revenueResult[0]?.totalRevenue || 0
        const totalOrders = revenueResult[0]?.totalOrders || 0

        // 2) Items sold today, grouped by category (e.g. បាយ, គុយទាវ, កាហ្វេ)
        const itemsSoldByCategory = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: '_id',
                    as: 'orderInfo'
                }
            },
            { $unwind: '$orderInfo' },
            {
                $match: {
                    'orderInfo.status': 'completed',
                    'orderInfo.createdAt': { $gte: start, $lte: end }
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'menu',
                    foreignField: '_id',
                    as: 'menuInfo'
                }
            },
            { $unwind: '$menuInfo' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'menuInfo.category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $group: {
                    _id: '$categoryInfo.name',
                    quantitySold: { $sum: '$quantity' },
                    revenue: { $sum: '$price' }
                }
            },
            { $sort: { quantitySold: -1 } }
        ])

        // 3) Best selling individual menu items today
        const topItems = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: '_id',
                    as: 'orderInfo'
                }
            },
            { $unwind: '$orderInfo' },
            {
                $match: {
                    'orderInfo.status': 'completed',
                    'orderInfo.createdAt': { $gte: start, $lte: end }
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'menu',
                    foreignField: '_id',
                    as: 'menuInfo'
                }
            },
            { $unwind: '$menuInfo' },
            {
                $group: {
                    _id: '$menuInfo.name',
                    quantitySold: { $sum: '$quantity' },
                    revenue: { $sum: '$price' }
                }
            },
            { $sort: { quantitySold: -1 } },
            { $limit: 10 }
        ])

        res.status(200).json({
            success: true,
            message: 'Daily report fetched successfully',
            data: {
                date: start.toISOString().split('T')[0],
                totalRevenue,
                totalOrders,
                itemsSoldByCategory: itemsSoldByCategory.map(item => ({
                    category: item._id,
                    quantitySold: item.quantitySold,
                    revenue: item.revenue
                })),
                topItems: topItems.map(item => ({
                    name: item._id,
                    quantitySold: item.quantitySold,
                    revenue: item.revenue
                }))
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    getDailyReport
}
