import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";
import AdminRoute from "../components/AdminRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PostForm from "../pages/PostForm";
import PostView from "../pages/guest/PostView";
import AdminPage from "../pages/admin/AdminPage";
import UserDetails from "../pages/registered/UserDetails";

export default function AppRouter(){
    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home/>} />
            <Route path="/posts/:id" element={<PostView/>}/>

            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/posts/create" element={<PostForm/>}/>
                <Route path="/users/:id" element={<UserDetails/>}/>
            </Route>
            <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<AdminPage/>}/>
            </Route>
        </Routes>
    )
}