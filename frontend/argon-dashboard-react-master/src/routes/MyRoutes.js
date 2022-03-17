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
//import Home from "./Home";


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
                <Route path='dashboard' element={<AdminLayout />} />
               {/* 
                 <Route path="/" element={<Index />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />*/}
            </Route>
            
            {/* Any input that isn't below, redirect to Login */}
            <Route path="*" element={<Navigate to='/auth/login' replace />}/>
        </Route>
    </Routes>
    )
}

export default MyRoutes;