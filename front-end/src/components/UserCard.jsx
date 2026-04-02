import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserCard({id, username, displayname, isAuthorized}) {
    
    const navigate = useNavigate();

    function goToUserPage(){
        navigate(`/users/${id}`);
    }

    return (
        <>
            <Card sx = {{width: 650}}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary"}}>
                        {displayname}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={goToUserPage}>View User Details</Button>  
                </CardActions>
            </Card>
        </>
    )
}
