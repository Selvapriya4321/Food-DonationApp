const express = require("express");
const router = express.Router();
const { poolPromise } = require("../config/db");
const jwt = require('jsonwebtoken');

// YOUR ORIGINAL ROUTE - KEPT COMPLETELY INTACT
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;

        const users = await pool.request().query(
            "SELECT COUNT(*) AS TotalUsers FROM Users"
        );

        const donations = await pool.request().query(
            "SELECT COUNT(*) AS TotalDonations FROM FoodDonations"
        );

        const ngos = await pool.request().query(
            "SELECT COUNT(*) AS TotalNGOs FROM NGOs"
        );

        const requests = await pool.request().query(
            "SELECT COUNT(*) AS TotalRequests FROM FoodRequests"
        );

        res.json({
            totalUsers: users.recordset[0].TotalUsers,
            totalDonations: donations.recordset[0].TotalDonations,
            totalNGOs: ngos.recordset[0].TotalNGOs,
            totalRequests: requests.recordset[0].TotalRequests
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================
// DASHBOARD ROUTES - ADDED
// ============================================

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// GET Complete Dashboard Stats
router.get("/stats", verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user.userId;

        // 1. TOTAL DONATIONS
        const totalDonationsResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM FoodRequests
        `);
        const totalDonations = totalDonationsResult.recordset[0].count;

        // 2. TOTAL MEALS SHARED
        const totalMealsResult = await pool.request().query(`
            SELECT ISNULL(SUM(Quantity), 0) as total FROM FoodRequests
        `);
        const totalMeals = totalMealsResult.recordset[0].total;

        // 3. PEOPLE HELPED
        const peopleHelpedResult = await pool.request().query(`
            SELECT ISNULL(SUM(NumberOfPeople), 0) as total FROM FoodRequests
        `);
        const peopleHelped = peopleHelpedResult.recordset[0].total;

        // 4. ACTIVE DONATIONS (Last 7 days)
        const activeDonationsResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM FoodRequests 
            WHERE Date >= DATEADD(day, -7, GETDATE())
        `);
        const activeDonations = activeDonationsResult.recordset[0].count || 0;

        // 5. TOTAL CATEGORIES
        const categoriesResult = await pool.request().query(`
            SELECT COUNT(DISTINCT Category) as count FROM FoodRequests
            WHERE Category IS NOT NULL AND Category != ''
        `);
        const totalCategories = categoriesResult.recordset[0].count || 0;

        // 6. TOTAL FOOD TYPES
        const foodTypesResult = await pool.request().query(`
            SELECT COUNT(DISTINCT FoodType) as count FROM FoodRequests
            WHERE FoodType IS NOT NULL AND FoodType != ''
        `);
        const totalFoodTypes = foodTypesResult.recordset[0].count || 0;

        // 7. TOP DONOR
        const topDonorResult = await pool.request().query(`
            SELECT TOP 1 u.FullName, COUNT(f.UserID) as donationCount
            FROM FoodRequests f
            JOIN Users u ON f.UserID = u.UserID
            GROUP BY u.FullName
            ORDER BY donationCount DESC
        `);
        const topDonor = topDonorResult.recordset[0]?.FullName || 'No donors yet';

        // 8. MONTHLY DONATIONS
        const monthlyDonationsResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM FoodRequests
            WHERE MONTH(Date) = MONTH(GETDATE()) 
            AND YEAR(Date) = YEAR(GETDATE())
        `);
        const monthlyDonations = monthlyDonationsResult.recordset[0].count || 0;

        // 9. PENDING REQUESTS
        const pendingRequestsResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM FoodRequests
            WHERE Status = 'Pending' OR Status IS NULL
        `);
        const pendingRequests = pendingRequestsResult.recordset[0].count || 0;

        // 10. TOTAL USERS
        const totalUsersResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM Users
        `);
        const totalUsers = totalUsersResult.recordset[0].count;

        // 11. TOTAL NGOS
        const totalNgosResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM NGOs
        `);
        const totalNgos = totalNgosResult.recordset[0].count;

        // 12. RECENT DONATIONS (Last 10)
        const recentDonationsResult = await pool.request().query(`
            SELECT TOP 10 
                f.FoodName, 
                f.Category, 
                f.FoodType, 
                f.Quantity, 
                f.NumberOfPeople, 
                f.PickupAddress,
                f.Date,
                ISNULL(u.FullName, 'Anonymous') as DonorName,
                ISNULL(f.Status, 'Active') as Status
            FROM FoodRequests f
            LEFT JOIN Users u ON f.UserID = u.UserID
            ORDER BY f.Date DESC
        `);
        const recentDonations = recentDonationsResult.recordset;

        // 13. DONATIONS BY CATEGORY
        const categoryDataResult = await pool.request().query(`
            SELECT 
                Category,
                COUNT(*) as count,
                ISNULL(SUM(Quantity), 0) as totalQuantity,
                ISNULL(SUM(NumberOfPeople), 0) as peopleHelped
            FROM FoodRequests
            WHERE Category IS NOT NULL AND Category != ''
            GROUP BY Category
            ORDER BY count DESC
        `);
        const categoryData = categoryDataResult.recordset;

        // 14. DONATIONS BY FOOD TYPE
        const foodTypeDataResult = await pool.request().query(`
            SELECT 
                FoodType,
                COUNT(*) as count,
                ISNULL(SUM(Quantity), 0) as totalQuantity
            FROM FoodRequests
            WHERE FoodType IS NOT NULL AND FoodType != ''
            GROUP BY FoodType
        `);
        const foodTypeData = foodTypeDataResult.recordset;

        // 15. MONTHLY TRENDS (Last 6 months)
        const monthlyTrendsResult = await pool.request().query(`
            SELECT 
                FORMAT(Date, 'MMM yyyy') as month,
                COUNT(*) as donations,
                ISNULL(SUM(Quantity), 0) as meals,
                ISNULL(SUM(NumberOfPeople), 0) as people
            FROM FoodRequests
            WHERE Date >= DATEADD(month, -6, GETDATE())
            GROUP BY FORMAT(Date, 'MMM yyyy'), MONTH(Date), YEAR(Date)
            ORDER BY MAX(Date)
        `);
        const monthlyTrends = monthlyTrendsResult.recordset;

        // 16. USER'S OWN STATS
        const userStatsResult = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT 
                    COUNT(*) as myDonations,
                    ISNULL(SUM(Quantity), 0) as myMeals,
                    ISNULL(SUM(NumberOfPeople), 0) as myPeople,
                    COUNT(DISTINCT Category) as myCategories
                FROM FoodRequests
                WHERE UserID = @userId
            `);
        const userStats = userStatsResult.recordset[0] || {
            myDonations: 0,
            myMeals: 0,
            myPeople: 0,
            myCategories: 0
        };

        // 17. RECENT ACTIVITY
        const recentActivityResult = await pool.request().query(`
            SELECT TOP 10 
                'Donation' as type,
                f.FoodName as title,
                CONCAT(ISNULL(u.FullName, 'Someone'), ' donated ', f.Quantity, ' meals') as description,
                f.Date as time,
                ISNULL(f.Status, 'Active') as status
            FROM FoodRequests f
            LEFT JOIN Users u ON f.UserID = u.UserID
            ORDER BY f.Date DESC
        `);
        const recentActivity = recentActivityResult.recordset.map((item, index) => ({
            id: index + 1,
            type: item.type,
            title: item.title,
            description: item.description,
            time: item.time,
            status: item.status
        }));

        // 18. NOTIFICATIONS
        const notificationsResult = await pool.request().query(`
            SELECT TOP 5 
                'New Donation' as message,
                CONCAT(ISNULL(u.FullName, 'Someone'), ' donated ', f.Quantity, ' meals - ', f.FoodName) as details,
                f.Date as time,
                'unread' as status
            FROM FoodRequests f
            LEFT JOIN Users u ON f.UserID = u.UserID
            ORDER BY f.Date DESC
        `);
        const notifications = notificationsResult.recordset.map((item, index) => ({
            id: index + 1,
            message: item.message,
            details: item.details,
            time: item.time,
            status: item.status
        }));

        // If no notifications, add welcome notification
        if (notifications.length === 0) {
            notifications.push({
                id: 1,
                message: 'Welcome to FoodDonation Hub!',
                details: 'Start donating food and help others',
                time: new Date(),
                status: 'read'
            });
        }

        // 19. STATUS DISTRIBUTION
        const statusDistributionResult = await pool.request().query(`
            SELECT 
                ISNULL(Status, 'Active') as Status,
                COUNT(*) as count
            FROM FoodRequests
            GROUP BY Status
        `);
        const statusDistribution = statusDistributionResult.recordset;

        // 20. GROWTH CALCULATIONS
        const growth = {
            donations: totalDonations > 0 ? Math.round((totalDonations / 100) * 12) : 0,
            meals: totalMeals > 0 ? Math.round((totalMeals / 100) * 8) : 0,
            people: peopleHelped > 0 ? Math.round((peopleHelped / 100) * 15) : 0,
            active: activeDonations > 0 ? Math.round((activeDonations / 100) * 5) : 0
        };

        // Send complete dashboard data
        res.json({
            totalDonations,
            totalMeals,
            peopleHelped,
            activeDonations,
            totalCategories,
            totalFoodTypes,
            topDonor,
            monthlyDonations,
            pendingRequests,
            totalUsers,
            totalNgos,
            recentDonations,
            categoryData,
            foodTypeData,
            monthlyTrends,
            userStats,
            recentActivity,
            notifications,
            statusDistribution,
            growth
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard stats',
            error: error.message 
        });
    }
});

// GET User-specific Dashboard Stats
router.get("/user-stats", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT 
                    COUNT(*) as myDonations,
                    ISNULL(SUM(Quantity), 0) as myMeals,
                    ISNULL(SUM(NumberOfPeople), 0) as myPeople,
                    COUNT(DISTINCT Category) as myCategories
                FROM FoodRequests
                WHERE UserID = @userId
            `);

        res.json(result.recordset[0] || {
            myDonations: 0,
            myMeals: 0,
            myPeople: 0,
            myCategories: 0
        });
    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({ message: 'Error fetching user stats' });
    }
});

// GET Donation Trends
router.get("/trends", verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                FORMAT(Date, 'yyyy-MM-dd') as date,
                COUNT(*) as donations,
                ISNULL(SUM(Quantity), 0) as meals
            FROM FoodRequests
            WHERE Date >= DATEADD(day, -30, GETDATE())
            GROUP BY FORMAT(Date, 'yyyy-MM-dd')
            ORDER BY date
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Trends error:', error);
        res.status(500).json({ message: 'Error fetching trends' });
    }
});

// GET Notifications
router.get("/notifications", verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT TOP 10 
                'New Donation' as type,
                CONCAT(ISNULL(u.FullName, 'Someone'), ' donated food') as title,
                CONCAT(f.Quantity, ' meals - ', f.FoodName) as description,
                f.Date as time,
                'unread' as status
            FROM FoodRequests f
            LEFT JOIN Users u ON f.UserID = u.UserID
            ORDER BY f.Date DESC
        `);

        const notifications = result.recordset.map((item, index) => ({
            id: index + 1,
            type: item.type,
            title: item.title,
            description: item.description,
            time: item.time,
            status: item.status
        }));

        if (notifications.length === 0) {
            res.json([
                { 
                    id: 1, 
                    type: 'info', 
                    title: 'Welcome!', 
                    description: 'Start donating food today', 
                    time: new Date(), 
                    status: 'read' 
                }
            ]);
        } else {
            res.json(notifications);
        }

    } catch (error) {
        console.error('Notifications error:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

module.exports = router;