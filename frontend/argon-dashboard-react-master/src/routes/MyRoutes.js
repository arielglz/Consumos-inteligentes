import { React } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LayoutAuth from "../layouts/Auth";
import Login from "../views/examples/Login";
import Register from "../views/examples/Register"
import AdminLayout from "../layouts/Admin.js";
import AuthLayout from "../layouts/Auth.js";
//import Dashboard from "./Dashboard"
import RequireAuth from "../hooks/RequireAuth";
import Index from "views/Index";
import Devices from "../components/Devices"
import Locations from "components/Locations";
import Bills from "components/Bills";
import Consumptions from "components/Consumptions";
import Profile from "views/examples/Profile";
//import Home from "./Home";

const token = localStorage.getItem('auth-token')

function MyRoutes(){
    return(
    <Routes>
        {/*element={<LayoutAuth />}*/}
        <Route path="/">
            {/* Public routes */}
            <Route path="auth" element={<LayoutAuth />} >
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>


            {/* 
            <Route path="admin" render={(props) => <AdminLayout {...props} />} />
            <Route path="auth" render={(props) => <AuthLayout {...props} />} />
            <Route path="/" to={<Navigate to="/admin/index" />} />
            */}
            {/* Protected routes */}
            <Route element={<RequireAuth />}>
               <Route element={<AdminLayout />}>
                    <Route path='dashboard' element={<Index />} />
                    <Route path='devices' element={<Devices />} />
                    <Route path='locations' element={<Locations />} />
                    <Route path='bills' element={<Bills />} />
                    <Route path='consumptions' element={<Consumptions />} />
                    <Route path='profile' element={<Profile />} />
                </Route>
            </Route>
            
            {/* Any input that isn't below, redirect to Dashboard or Login */}
            <Route path="*" element={
            token ? <Navigate to='/dashboard' replace />
                  : <Navigate to='/auth/login' replace />}/>
        </Route>
    </Routes>
    )
}

export default MyRoutes;