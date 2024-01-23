import React from "react";
import { createContext, useContext, useState } from "react";

export const TitleContext = createContext(null);

export const useTitle = () => useContext(TitleContext);

export const TitleProvider = ({ children }) => {
    const [title, setTitle] = useState('Dashboard');
    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
};