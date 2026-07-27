import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaUtensils, FaUsers, FaHeart } from 'react-icons/fa';
import { MdFoodBank } from 'react-icons/md';

function Home() {
    return (
        <div className="home">
            {/* ===== HERO SECTION ===== */}
            <section className="hero">
                <div className="hero-content">
                    <h1>
                        Share Food.<br />
                        <span className="highlight">Spread Happiness.</span>
                    </h1>
                    <p>
                        Donate extra food and help reduce hunger
                        in your community. Together we can make a difference.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/donate" className="btn-primary">
                            <MdFoodBank />
                            Donate Food
                        </Link>
                        <Link to="/foodlist" className="btn-secondary">
                            Find Food
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Meals Donated</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">200+</span>
                            <span className="stat-label">Happy Families</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">NGO Partners</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    <img 
                        src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&h=500&fit=crop"
                        alt="Sharing food with community"
                    />
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Why Choose FoodDonate?</h2>
                    <p className="section-subtitle">
                        Making food donation simple, transparent, and impactful.
                    </p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon-wrapper">🌱</span>
                            <h3>Reduce Waste</h3>
                            <p>
                                Save excess food from being wasted. Every donation
                                helps reduce food waste and protect our environment.
                            </p>
                        </div>

                        <div className="feature-card">
                            <span className="feature-icon-wrapper">❤️</span>
                            <h3>Help People</h3>
                            <p>
                                Connect food donors with receivers. Your donation
                                can feed a family in need and bring smiles.
                            </p>
                        </div>

                        <div className="feature-card">
                            <span className="feature-icon-wrapper">🤝</span>
                            <h3>Build Community</h3>
                            <p>
                                Create a hunger-free society. Together we can
                                build a stronger, more caring community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Make a Difference?</h2>
                    <p>
                        Start donating food today and help us create a hunger-free world.
                        Every small contribution makes a big impact.
                    </p>
                    <Link to="/register" className="btn-primary">
                        Get Started Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;