// frontend/src/context/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    const showLoading = (message = 'Loading...') => {
        setLoadingMessage(message);
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
        setLoadingMessage('Loading...');
    };

    const value = {
        loading,
        setLoading,
        loadingMessage,
        setLoadingMessage,
        showLoading,
        hideLoading
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export default LoadingContext;