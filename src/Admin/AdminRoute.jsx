import React, { useContext } from 'react';
import useUserRole from '../hooks/useUserRole';
import { AuthContext } from '../Authentication/AuthContext';
import { Navigate, useLocation } from 'react-router';


const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const { role, roleLoading } = useUserRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }
    
    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location }} to="/" replace />
    }

    return children;
};

export default AdminRoute;
