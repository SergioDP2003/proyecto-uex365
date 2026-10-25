import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const token = localStorage.getItem('access_token');

    if (!token || !isAdmin) {
        // Si no está logueado o no es admin, patada hacia la home normal
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;