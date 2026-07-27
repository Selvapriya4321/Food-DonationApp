import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// App
import App from "./App";

// Global Styles
import "./index.css";
import "./App.css";
import "./styles/global.css";

// New Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider>
                    <LoadingProvider>
                        <Toaster
                            position="top-right"
                            reverseOrder={false}
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    borderRadius: "10px",
                                    background: "#2E7D32",
                                    color: "#fff",
                                    fontSize: "15px"
                                }
                            }}
                        />
                        <App />
                    </LoadingProvider>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);