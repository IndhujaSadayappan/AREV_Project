import React, { createContext, useState, useContext } from 'react';
import { translations } from '../translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [user, setUser] = useState(null); // { city, personId }

    const t = translations[language];

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
    };

    const login = (city, personId) => {
        setUser({ city, personId });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AppContext.Provider value={{ language, toggleLanguage, user, login, logout, t }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
