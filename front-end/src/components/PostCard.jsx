import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PostCard({title, text, id}) {
    
    const navigate = useNavigate();

    function goToPostPage(){
        navigate(`/posts/${id}`);
    }

    return (
        <>
            <Card sx = {{width: 650}}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary"}}>
                        {text}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={goToPostPage}>View Post</Button>  
                </CardActions>
            </Card>
        </>
    )
}
