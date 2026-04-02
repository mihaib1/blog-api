import { getUserFromToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Button,
} from "@mui/material";

export default function Header() {

    const navigate = useNavigate();
    const user = getUserFromToken();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login", {replace: true});
    }
    
    const goToAddPostForm = () => {
        navigate("/posts/create");
        console.log("Clicked addPost button -> will redirect to post creation page.");
    }

    const goToLogin = () => {
        navigate("/login", {replace: true});
    }

    const goToRegister = () => {
        navigate("/register", {replace: true})
    }

    const goHome = () => {
        navigate("/", {replace: true})
    }

    const goToAdminPage = () => {
        navigate("/admin/users", {replace: true});
    }
    return (
        <>
            <header style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd"
            }}>
                {user ? (
                    <>
                        <span>
                                <Button size="medium"  onClick={goHome}>Home</Button>
                                <span style={{marginLeft:"1rem"}}> Hello, {user.username} </span>
                        </span>
                        <span>
                            <Stack spacing={2} direction="row"> 
                                {user.role === "ADMIN" ? (<><Button variant="contained" size="medium" onClick={goToAdminPage}> Admin Page</Button></>) : <></> }
                                <Button variant="contained" size="medium" onClick={goToAddPostForm}>Add a post</Button>
                                <Button variant="contained" size="medium" color="error" onClick={logout}>Logout</Button>
                            </Stack>
                        </span>
                        
                    </>
                ) : (
                    <>
                        <span>
                            <Button variant="contained" size="medium" onClick={goHome}>Home</Button>
                            <span style={{marginLeft:"1rem"}}> Hello, user. You are not logged in!</span>
                        </span>
                        {window.location.pathname !== "/login" && 
                        <Stack direction="row" spacing={{xs: 1, sm: 2}}> 
                            <Button onClick={goToLogin} variant="contained" color="success">Log in</Button> 
                            <Button onClick={goToRegister} variant="contained"> Register </Button>
                        </Stack>
                        }
                        
                    </>
                )}
            </header>
        </>
    )
}