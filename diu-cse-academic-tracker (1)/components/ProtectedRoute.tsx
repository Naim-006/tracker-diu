import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute: React.FC = () => {
    const { profile, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#020617]">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return <Navigate to="/login" replace />;
    }

    if (profile.role !== 'CR') {
        return <Navigate to="/dashboard" replace />;
    }

    if (!profile.is_approved) {
        return <Navigate to="/pending-approval" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
