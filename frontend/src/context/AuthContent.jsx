// import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { get } from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, loading: true});
    const [modal, setModal] = useState(false)

    const checkSession = useCallback(async () => {
        try {
            await get("/auth/check-session");
            setAuth({ isAuthenticated: true, loading: false });
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setAuth({ isAuthenticated: false, loading: false });
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    

    return(
        <AuthContext.Provider value={{ auth, setAuth, modal, setModal }}>
            {children}
        </AuthContext.Provider>
    )
}