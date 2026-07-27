import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import splash from "../assets/splash.jpg";

function SplashScreen() {

    const navigate = useNavigate();

    useEffect(() => {

        localStorage.removeItem("token");

        const timer = setTimeout(() => {
            navigate("/login", { replace: true });
        }, 5000);

        return () => clearTimeout(timer);

    }, [navigate]);


    return (
        <div className="splash">

            <img
                src={splash}
                alt="Food Donation"
                className="splash-image"
            />

            <div className="overlay">

                <h1>Food Donation</h1>

                <p>
                    Share Food • Save Lives
                </p>

            </div>

        </div>
    );
}

export default SplashScreen;