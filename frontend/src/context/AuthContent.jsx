import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, loading: true});

    useEffect(() => {
        axios.get("/auth/check-session").then(()=>setAuth({ isAuthenticated: true, loading: false })).catch(()=> setAuth({isAuthenticated: false, loading: false}))
    }, [])

    return(
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)