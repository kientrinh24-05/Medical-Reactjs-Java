import React, { createContext, useState } from 'react'

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleMenu = ()=>{
        setCollapsed(!collapsed)
    }
    return (
        <AppContext.Provider value={{ collapsed, toggleMenu }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext;
