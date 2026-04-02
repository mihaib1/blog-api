import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  console.log(jwtDecode(token));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if(token){
    let decodedToken = jwtDecode(token);
    if(decodedToken.role !== "ADMIN"){
        return <Navigate to="/" replace />
    }
  }

  return <Outlet />;
}