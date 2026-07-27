import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// Import background image
import dashboardBg from "../assets/dashboard-bg.png.jpeg";

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("User");
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalMeals: 0,
        peopleHelped: 0,
        activeDonations: 0,
        recentDonations: [],
        totalCategories: 0,
        totalFoodTypes: 0,
        topDonor: "",
        monthlyDonations: 0,
        pendingRequests: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Your donation is ready for pickup", time: "2 mins ago" },
        { id: 2, message: "New food request from Chennai", time: "1 hour ago" },
        { id: 3, message: "Thank you for your donation!", time: "3 hours ago" }
    ]);

    useEffect(() => {
        const name = localStorage.getItem("FullName");
        if (name) setUserName(name);
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/dashboard/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load dashboard data");
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("FullName");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div 
            className="dashboard-page"
            style={{
                backgroundImage: `url(${dashboardBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh'
            }}
        >
            {/* Overlay for readability */}
            <div className="dashboard-overlay"></div>

            {/* Header Section */}
            <header className="dashboard-header">
                <div className="header-top">
                    <div className="logo-section">
                        <span className="logo-icon">🍱</span>
                        <h1>FoodDonation Hub</h1>
                    </div>
                    <div className="header-actions">
                        <div className="notification-wrapper">
                            <button 
                                className="notification-btn"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                🔔
                                <span className="notification-badge">3</span>
                            </button>
                            {showNotifications && (
                                <div className="notification-dropdown">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="notification-item">
                                            <p>{notif.message}</p>
                                            <span>{notif.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="user-profile" onClick={() => navigate("/profile")}>
                            <div className="user-avatar">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                                <span className="user-name">Welcome, {userName}</span>
                                <span className="user-role">Donor</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="welcome-message">
                    <h2>🌟 Your small help can feed someone today</h2>
                    <p>Together we can make a difference in our community</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon food-icon">🍱</div>
                    <div className="stat-content">
                        <h3>Total Donations</h3>
                        <h2>{stats.totalDonations}</h2>
                        <span className="stat-change">↑ 12% this month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon meal-icon">🍽️</div>
                    <div className="stat-content">
                        <h3>Meals Shared</h3>
                        <h2>{stats.totalMeals}</h2>
                        <span className="stat-change">↑ 8% this week</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon people-icon">👥</div>
                    <div className="stat-content">
                        <h3>People Helped</h3>
                        <h2>{stats.peopleHelped}</h2>
                        <span className="stat-change">↑ 15% this month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon active-icon">📦</div>
                    <div className="stat-content">
                        <h3>Active Donations</h3>
                        <h2>{stats.activeDonations}</h2>
                        <span className="stat-change">Available now</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="quick-stat-card">
                    <span className="quick-icon">🏆</span>
                    <div>
                        <span className="quick-label">Categories</span>
                        <span className="quick-value">{stats.totalCategories}</span>
                    </div>
                </div>
                <div className="quick-stat-card">
                    <span className="quick-icon">🕐</span>
                    <div>
                        <span className="quick-label">Food Types</span>
                        <span className="quick-value">{stats.totalFoodTypes}</span>
                    </div>
                </div>
                <div className="quick-stat-card">
                    <span className="quick-icon">❤️</span>
                    <div>
                        <span className="quick-label">Top Donor</span>
                        <span className="quick-value">{stats.topDonor || "You"}</span>
                    </div>
                </div>
                <div className="quick-stat-card">
                    <span className="quick-icon">📅</span>
                    <div>
                        <span className="quick-label">This Month</span>
                        <span className="quick-value">{stats.monthlyDonations}</span>
                    </div>
                </div>
                <div className="quick-stat-card">
                    <span className="quick-icon">⏳</span>
                    <div>
                        <span className="quick-label">Pending</span>
                        <span className="quick-value">{stats.pendingRequests}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="main-content-grid">
                {/* Recent Donations Table */}
                <div className="recent-donations">
                    <div className="section-header">
                        <h3>📋 Recent Donations</h3>
                        <button onClick={() => navigate("/donations")} className="view-all-btn">
                            View All →
                        </button>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Food</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>People</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentDonations.length > 0 ? (
                                    stats.recentDonations.slice(0, 5).map((donation, index) => (
                                        <tr key={index}>
                                            <td><strong>{donation.FoodName}</strong></td>
                                            <td>{donation.Category}</td>
                                            <td>
                                                <span className={`food-type ${donation.FoodType === 'Veg' ? 'veg' : 'non-veg'}`}>
                                                    {donation.FoodType}
                                                </span>
                                            </td>
                                            <td>{donation.Quantity}</td>
                                            <td>{donation.NumberOfPeople}</td>
                                            <td>{donation.PickupAddress}</td>
                                            <td>
                                                <span className="status-badge active">Active</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-data">No donations yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions & Stats */}
                <div className="quick-actions">
                    <div className="action-card">
                        <h4>Quick Actions</h4>
                        <button className="action-btn primary" onClick={() => navigate("/donate")}>
                            🍛 Donate Food
                        </button>
                        <button className="action-btn secondary" onClick={() => navigate("/donations")}>
                            📋 View All Donations
                        </button>
                        <button className="action-btn success" onClick={() => navigate("/profile")}>
                            👤 My Profile
                        </button>
                    </div>

                    <div className="achievement-card">
                        <h4>🏅 Your Achievements</h4>
                        <div className="achievement-item">
                            <span>🎯</span>
                            <div>
                                <p>First Donation</p>
                                <span className="achievement-status">✅ Completed</span>
                            </div>
                        </div>
                        <div className="achievement-item">
                            <span>🌟</span>
                            <div>
                                <p>5 Donations</p>
                                <span className="achievement-status">⏳ In Progress</span>
                            </div>
                        </div>
                        <div className="achievement-item">
                            <span>💪</span>
                            <div>
                                <p>Helped 50 People</p>
                                <span className="achievement-status">⏳ In Progress</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="dashboard-nav-buttons">
                <button className="nav-btn donate-btn" onClick={() => navigate("/donate")}>
                    🍛 Donate Food
                </button>
                <button className="nav-btn view-btn" onClick={() => navigate("/donations")}>
                    📋 View Donations
                </button>
                <button className="nav-btn profile-btn" onClick={() => navigate("/profile")}>
                    👤 Profile
                </button>
                <button className="nav-btn logout-btn" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;