import { Card, CardContent, Typography, Divider } from "@mui/material";

export default function CommentCard({comment, createdOn, createdBy}) {

    return (
        <>
            <Card sx = {{width:"100%"}}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <b>{createdBy}</b> said:
                    </Typography>
                    <Typography gutterBottom variant="subtitle2" sx={{color:"text.secondary"}}>
                        {new Date(createdOn).toLocaleDateString()} {new Date(createdOn).toLocaleTimeString()}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{mt:2}}>
                        {comment}
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}
