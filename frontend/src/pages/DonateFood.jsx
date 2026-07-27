// frontend/src/pages/DonateFood.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import '../styles/global.css';


function DonateFood() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = id !== undefined;
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [foodTypes, setFoodTypes] = useState(['Veg', 'Non-Veg']);
    const [formData, setFormData] = useState({
        FoodName: '',
        Category: '',
        FoodType: 'Veg',
        Quantity: '',
        NumberOfPeople: '',
        PickupAddress: '',
        City: '',
        State: '',
        Pincode: '',
        ExpiryDate: '',
        Description: '',
        Status: 'Pending' // Added Status field
    });

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
        fetchFoodTypes();
        if (isEditMode) {
            fetchDonationData(id);
        }
    }, [isEditMode, id]);

    // Fetch categories from database
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/donations/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            // Set default categories if API fails
            setCategories(['Rice', 'Dal', 'Vegetables', 'Fruits', 'Bread', 'Milk', 'Other']);
        }
    };

    // Fetch food types from database
    const fetchFoodTypes = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/donations/food-types", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.length > 0) {
                setFoodTypes(response.data);
            }
        } catch (err) {
            console.error("Error fetching food types:", err);
            // Keep default food types
        }
    };

    // Fetch donation data for edit mode
    const fetchDonationData = async (donationId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/api/donations/${donationId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const donation = response.data;
            setFormData({
                FoodName: donation.FoodName || '',
                Category: donation.Category || '',
                FoodType: donation.FoodType || 'Veg',
                Quantity: donation.Quantity || '',
                NumberOfPeople: donation.NumberOfPeople || '',
                PickupAddress: donation.PickupAddress || '',
                City: donation.City || '',
                State: donation.State || '',
                Pincode: donation.Pincode || '',
                ExpiryDate: donation.ExpiryDate ? donation.ExpiryDate.split('T')[0] : '',
                Description: donation.Description || '',
                Status: donation.Status || 'Pending'
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching donation:", err);
            toast.error("Failed to load donation data");
            setError("Failed to load donation data");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validate form before submission
    const validateForm = () => {
        const requiredFields = ['FoodName', 'Category', 'FoodType', 'Quantity', 'NumberOfPeople', 'PickupAddress'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                const errorMsg = `Please fill in ${field.replace(/([A-Z])/g, ' $1').trim()}`;
                setError(errorMsg);
                toast.error(errorMsg);
                return false;
            }
        }
        if (parseInt(formData.Quantity) < 1) {
            setError("Quantity must be at least 1");
            toast.error("Quantity must be at least 1");
            return false;
        }
        if (parseInt(formData.NumberOfPeople) < 1) {
            setError("Number of people must be at least 1");
            toast.error("Number of people must be at least 1");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            const token = localStorage.getItem("token");
            let response;
            
            // Prepare data for API - match database column names
            const donationData = {
                FoodName: formData.FoodName,
                Category: formData.Category,
                FoodType: formData.FoodType,
                Quantity: parseInt(formData.Quantity),
                NumberOfPeople: parseInt(formData.NumberOfPeople),
                PickupAddress: formData.PickupAddress,
                City: formData.City,
                State: formData.State,
                Pincode: formData.Pincode,
                ExpiryDate: formData.ExpiryDate || null,
                Description: formData.Description,
                Status: formData.Status || 'Pending'
            };
            
            if (isEditMode) {
                // Update existing donation
                response = await axios.put(
                    `http://localhost:5000/api/donations/${id}`,
                    donationData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                toast.success('Donation updated successfully! 🎉');
            } else {
                // Create new donation
                response = await axios.post(
                    "http://localhost:5000/api/donations/donate",
                    donationData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                toast.success('Donation created successfully! 🎉');
            }
            
            setSuccess(true);
            setLoading(false);
            
            // Reset form and redirect after 2 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
            
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} donation`;
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    // Success page
    if (success) {
        return (
            <div className="donate-success">
                <div className="success-card">
                    <span className="success-icon">🎉</span>
                    <h2>{isEditMode ? 'Donation Updated Successfully!' : 'Donation Created Successfully!'}</h2>
                    <p>
                        {isEditMode 
                            ? 'Your donation has been updated. Thank you for your continued support!' 
                            : 'Thank you for your generous donation. You\'re helping feed someone in need.'}
                    </p>
                    <p className="redirect-message">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    // Loading state for edit mode
    if (isEditMode && loading) {
        return (
            <div className="donate-loading">
                <div className="loader"></div>
                <p>Loading donation data...</p>
            </div>
        );
    }

    return (
        <div className="donate-page">
            <div className="donate-container">
                <div className="donate-card">
                    <div className="donate-header">
                        <span className="donate-icon">🍛</span>
                        <h1>{isEditMode ? 'Edit Donation' : 'Donate Food'}</h1>
                        <p>
                            {isEditMode 
                                ? 'Update your donation details' 
                                : 'Your small contribution can make a big difference'}
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="donate-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Food Name *</label>
                                <input
                                    type="text"
                                    name="FoodName"
                                    value={formData.FoodName}
                                    onChange={handleChange}
                                    placeholder="e.g., Biryani, Rice, Dal"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="Category"
                                    value={formData.Category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Food Type *</label>
                                <select
                                    name="FoodType"
                                    value={formData.FoodType}
                                    onChange={handleChange}
                                    required
                                >
                                    {foodTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Quantity (in kg/plates) *</label>
                                <input
                                    type="number"
                                    name="Quantity"
                                    value={formData.Quantity}
                                    onChange={handleChange}
                                    placeholder="e.g., 5"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Number of People *</label>
                                <input
                                    type="number"
                                    name="NumberOfPeople"
                                    value={formData.NumberOfPeople}
                                    onChange={handleChange}
                                    placeholder="e.g., 10"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="date"
                                    name="ExpiryDate"
                                    value={formData.ExpiryDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Pickup Address *</label>
                            <input
                                type="text"
                                name="PickupAddress"
                                value={formData.PickupAddress}
                                onChange={handleChange}
                                placeholder="Street address, landmark"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                    placeholder="e.g., Chennai"
                                />
                            </div>

                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="State"
                                    value={formData.State}
                                    onChange={handleChange}
                                    placeholder="e.g., Tamil Nadu"
                                />
                            </div>

                            <div className="form-group">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    name="Pincode"
                                    value={formData.Pincode}
                                    onChange={handleChange}
                                    placeholder="e.g., 600001"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Available">Available</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Picked Up">Picked Up</option>
                                <option value="Completed">Completed</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                placeholder="Any additional details about the food..."
                                rows="3"
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => navigate(isEditMode ? "/my-donations" : "/dashboard")}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn-submit"
                                disabled={loading}
                            >
                                {loading ? '⏳ Submitting...' : (isEditMode ? '✏️ Update Donation' : '🍛 Donate Food')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DonateFood;