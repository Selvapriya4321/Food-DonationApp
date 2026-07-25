import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DonateFood from "./pages/DonateFood";
import FoodList from "./pages/FoodList";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";


function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/donate" element={<DonateFood />} />

        <Route path="/food" element={<FoodList />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

      </Routes>


      <Footer />

    </BrowserRouter>
  );
}


export default App;