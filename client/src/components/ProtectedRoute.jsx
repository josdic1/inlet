import { Navigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth.jsx";

export function ProtectedRoute({ children }) {

    
    // if (loading) return <div>Loading...</div>;
    // if (!loggedIn) return <Navigate to="/login" replace />;
    
    return children;
}