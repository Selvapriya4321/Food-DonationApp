import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import DonateFood from "./pages/DonateFood";
import FoodList from "./pages/FoodList";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

// CSS
import "./App.css";
import "./styles/global.css";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  return (
    <div className="app">
      <Toaster position="top-right" />

      {!hideLayout && <Navbar />}

      <main className="main-content">
        <Routes>

          {/* Splash */}
          <Route path="/" element={<SplashScreen />} />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/foodlist" element={<FoodList />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <DonateFood />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              ADDED - Donation Management Routes
              ============================================ */}

          {/* View All Donations */}
          <Route
            path="/donations"
            element={
              <ProtectedRoute>
                <FoodList />
              </ProtectedRoute>
            }
          />

          {/* View Specific Donation */}
          <Route
            path="/donations/:id"
            element={
              <ProtectedRoute>
                <FoodList />
              </ProtectedRoute>
            }
          />

          {/* Edit Donation */}
          <Route
            path="/donations/edit/:id"
            element={
              <ProtectedRoute>
                <DonateFood />
              </ProtectedRoute>
            }
          />

          {/* My Donations */}
          <Route
            path="/my-donations"
            element={
              <ProtectedRoute>
                <FoodList />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              ADDED - Fallback Route (Optional)
              ============================================ */}
          
          {/* Catch all - redirect to dashboard if logged in, else login */}
          <Route 
            path="*" 
            element={
              localStorage.getItem("token") ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />

        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;