import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Divider, Typography, Button, TextField, Stack } from "@mui/material";
import CommentCard from "../../components/CommentCard";

export default function PostView() {
    const [postDetails, setPostDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [comment, setComment] = useState("");
    const [commentPosting, setCommentPostingStatus] = useState(false);

    const CHARACTER_LIMIT = 150;

    let params = useParams();
    let postId = params.id;

    const token = localStorage.getItem("token");

    async function submitComment(e){
        e.preventDefault();
        try{
            const commentUrl = import.meta.env.VITE_COMMENTS_URL;
            setCommentPostingStatus(true);
            const res = await fetch(commentUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({comment, postId})
            });

            if(!res.ok) throw new Error(`Error when posting comment!`);

            //const response = await res.json();

            setComment("");
        } catch(err){
            console.error(err);
            alert("Failed to post comment: " + err.message);
        } finally {
            setCommentPostingStatus(false);
        }
    }
    
    useEffect(() => {
        async function getPostDetails() {
            try{
                setError(false);
                setLoading(true);
                setCommentsLoading(true);
                const postUrl = import.meta.env.VITE_POSTS_URL + `/${postId}`;
                const res = await fetch(postUrl, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                    }
                });
                
                if (!res.ok) throw new Error("Error when fetching post data.");

                const data = await res.json();
                setPostDetails(data);
                if(data.data?.post?.comments){
                    setComments(data.data.post.comments)
                }
            }
            catch(err){
                setError(true);
                setLoading(false);
                setCommentsLoading(false);
                console.error(err);
            }
            finally{
                setLoading(false);
                setCommentsLoading(false);
            }
        }
        getPostDetails();
    }, [postId, commentPosting]);
    return(
        <>
            <Container>
                <p></p>
                <Box>
                    <Typography variant="h3" gutterBottom>
                        {loading && !postDetails && `Loading...`}
                        {!loading && !error && postDetails?.data?.post?.published && (
                            postDetails.data.post.title
                        )}
                        {!loading && !error && !postDetails?.data?.post?.published && (
                            `Post is not published.`
                        )}
                    </Typography>
                    <Divider />
                </Box>
                <Box sx={{width:'100%'}} alignItems="center">
                    <p></p>
                    <Typography gutterBottom variant="subtitle2">
                        {postDetails?.data?.post?.createdOn && (
                            `This post was created on ${new Date(postDetails.data.post.createdOn).toLocaleDateString()}`
                        )}
                    </Typography>
                    <Typography gutterBottom variant="body1">
                        {postDetails?.data?.post?.text && (
                            `${postDetails.data.post.text}`
                        )}
                    </Typography>
                </Box>
                <Box component="form" onSubmit={submitComment}>
                    {
                        token && <div style={{marginTop:'2rem'}} className="add-comment-container">
                        <TextField 
                            margin = 'normal'
                            fullWidth
                            multiline
                            label="Write your comment here..."
                            value = {comment} 
                            disabled={loading}
                            onChange={(e) => setComment(e.target.value)}
                            maxRows={10}
                            inputProps={{maxLength: 150}}
                            helperText={`${comment.length} / ${CHARACTER_LIMIT}`}
                        />
                        <Stack direction="row" justifyContent="end">
                            <Button variant="contained" size="medium" disabled = {commentPosting} type='submit'>
                                Submit Comment
                            </Button>
                        </Stack>
                        
                    </div>
                    }
                </Box>
                
                <Box sx={{width:'100%', mt:3}}>
                    {commentsLoading && `Comments loading...`}
                    <Stack spacing={3}>
                    {comments.map((commentObj) => (
                        <div key={commentObj.id}>
                            <CommentCard
                                comment = {commentObj.comment}
                                createdOn={commentObj.createdOn}
                                createdBy={commentObj.user.username ? commentObj.user.username : commentObj.user.email}
                            />
                        </div>                        
                    ))}
                    </Stack>
                </Box>
            </Container>
        </>
    ) 
} 