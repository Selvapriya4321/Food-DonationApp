import React, { useState } from "react";
import axios from "axios";
import bg from "../assets/forgot-bg.png";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
          newPassword
        }
      );

      setMessage(response.data.message);

// Remove the old login token
localStorage.removeItem("token");
localStorage.removeItem("user");

setTimeout(() => {
    navigate("/login");
}, 2000);

    } catch (error) {

      setMessage(
        error.response?.data?.message || "Something went wrong"
      );

    }

  };

  return (

    <div
      className="forgot-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="forgot-card">

        <h1>Forgot Password?</h1>

        <p>
          Don't worry! Enter your email and new password.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

        <p>{message}</p>

      </div>

    </div>

  );
}

export default ForgotPassword;