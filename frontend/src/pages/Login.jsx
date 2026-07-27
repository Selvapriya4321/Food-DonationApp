import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../services/api';
import '../styles/global.css';
import loginBg from "../assets/login-bg.jpg";


function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });
    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};
        
        if (!formData.Email) {
            newErrors.Email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
            newErrors.Email = 'Please enter a valid email';
        }
        
        if (!formData.Password) {
            newErrors.Password = 'Password is required';
        } else if (formData.Password.length < 6) {
            newErrors.Password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        setLoading(true);
        
        try {
            const response = await API.post('/auth/login', formData);
            
            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                localStorage.setItem(
    'FullName',
    response.data.user.FullName
);
                
                toast.success('Login successful! Welcome back!');
                
                
                // Redirect to dashboard after 1 second
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    if (data.message === 'Invalid credentials') {
                        toast.error('Invalid email or password. Please try again.');
                        setErrors({
                            ...errors,
                            Email: 'Invalid email or password',
                            Password: 'Invalid email or password'
                        });
                    } else {
                        toast.error(data.message || 'Login failed');
                    }
                } else if (status === 401) {
                    toast.error('Unauthorized. Please check your credentials.');
                } else if (status === 500) {
                    toast.error('Server error. Please try again later.');
                } else {
                    toast.error(data.message || 'Login failed. Please try again.');
                }
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
    className="auth-page"
    style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}
>
            <div
    className="auth-container"
    style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.45)",
    }}
>
                <div
    className="auth-card"
    style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        padding: "35px",
    }}
>
                    <div className="auth-header">
                        <div className="auth-icon">🍽️</div>
                        <h1>Welcome Back</h1>
                        <p>Login to continue helping others</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="Email">Email Address</label>
                            <div className="input-group">
                                <span className="input-icon">
                                    <FaEnvelope />
                                </span>
                                <input
                                    id="Email"
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={errors.Email ? 'input-error' : ''}
                                    disabled={loading}
                                />
                            </div>
                            {errors.Email && (
                                <span className="error-message">{errors.Email}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <div className="input-group">
                                <span className="input-icon">
                                    <FaLock />
                                </span>
                                <input
                                    id="Password"
                                    type="password"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={errors.Password ? 'input-error' : ''}
                                    disabled={loading}
                                />
                            </div>
                            {errors.Password && (
                                <span className="error-message">{errors.Password}</span>
                            )}
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;