import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../services/api';
import '../styles/global.css';
import registerBg from "../assets/register-bg.jpg";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Phone: '',
        Password: '',
        ConfirmPassword: '',
        Role: 'Donor'
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.FullName) {
            newErrors.FullName = 'Full name is required';
        } else if (formData.FullName.length < 2) {
            newErrors.FullName = 'Name must be at least 2 characters';
        }
        
        if (!formData.Email) {
            newErrors.Email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
            newErrors.Email = 'Please enter a valid email';
        }
        
        if (formData.Phone && !/^[0-9]{10}$/.test(formData.Phone)) {
            newErrors.Phone = 'Phone number must be 10 digits';
        }
        
        if (!formData.Password) {
            newErrors.Password = 'Password is required';
        } else if (formData.Password.length < 6) {
            newErrors.Password = 'Password must be at least 6 characters';
        }
        
        if (!formData.ConfirmPassword) {
            newErrors.ConfirmPassword = 'Please confirm your password';
        } else if (formData.Password !== formData.ConfirmPassword) {
            newErrors.ConfirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        setLoading(true);
        
       try {
    const { ConfirmPassword, ...registerData } = formData;

    const response = await API.post('/auth/register', registerData);

    if (response.data.success) {

    toast.success("Registration Successful");

    setTimeout(() => {
        navigate("/login");
    }, 2000);

}

} catch (error) {
    console.error('Registration error:', error);

    if (error.validationErrors) {
        setErrors(error.validationErrors);
    }
} finally {
    setLoading(false);
}
    };

    return (
        <div
    className="auth-page"
    style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
    }}
>
            <div className="auth-container">
                <div className="auth-card register-card">
                    <div className="auth-header">
                        <div className="auth-icon">🌟</div>
                        <h1>Create Account</h1>
                        <p>Join us in fighting hunger</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="FullName">Full Name</label>
                            <div className="input-group">
                                <span className="input-icon">
                                    <FaUser />
                                </span>
                                <input
                                    id="FullName"
                                    type="text"
                                    name="FullName"
                                    value={formData.FullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={errors.FullName ? 'input-error' : ''}
                                    disabled={loading}
                                />
                            </div>
                            {errors.FullName && (
                                <span className="error-message">{errors.FullName}</span>
                            )}
                        </div>

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
                            <label htmlFor="Phone">Phone Number (Optional)</label>
                            <div className="input-group">
                                <span className="input-icon">
                                    <FaPhone />
                                </span>
                                <input
                                    id="Phone"
                                    type="tel"
                                    name="Phone"
                                    value={formData.Phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className={errors.Phone ? 'input-error' : ''}
                                    disabled={loading}
                                />
                            </div>
                            {errors.Phone && (
                                <span className="error-message">{errors.Phone}</span>
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
                                    placeholder="Create a password (min 6 characters)"
                                    className={errors.Password ? 'input-error' : ''}
                                    disabled={loading}
                                />
                            </div>
                            {errors.Password && (
                                <span className="error-message">{errors.Password}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="ConfirmPassword">Confirm Password</label>
                            <div className="input-group">
                                <span className="input-icon">
                                    <FaLock />
                                </span>
                                <input
                                    id="ConfirmPassword"
                                    type="password"
                                    name="ConfirmPassword"
                                    value={formData.ConfirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={errors.ConfirmPassword ? 'input-error' : ''}
                                    disabled={loading}
                                />
                            </div>
                            {errors.ConfirmPassword && (
                                <span className="error-message">{errors.ConfirmPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="Role">I am a</label>
                            <select
                                id="Role"
                                name="Role"
                                value={formData.Role}
                                onChange={handleChange}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="Donor">Donor - I want to donate food</option>
                                <option value="NGO">NGO - I represent an NGO</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Login Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;