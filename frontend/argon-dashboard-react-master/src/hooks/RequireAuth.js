import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    //const location = useLocation();
    const token = localStorage.getItem('auth-token')
    return (
        token
            ? <Outlet />
            : <Navigate to="/auth/login" />
           
           
    );
}
{/* : <Navigate to="/login" state={{ from: location }} replace />*/}
export default RequireAuth;