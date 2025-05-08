import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContent";
import { useContext } from "react";

export default function ProtectedRoute({children}){
    
    const { auth } = useContext(AuthContext)

    if (auth.loading) return <div>Loading...</div>

    return auth.isAuthenticated ? children : <Navigate to="/login" />
}