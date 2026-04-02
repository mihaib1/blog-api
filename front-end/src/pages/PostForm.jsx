import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Box, Typography, Alert, TextField } from "@mui/material";

export default function PostForm() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const CHARACTER_LIMIT = 150;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try{
            const postsUrl = import.meta.env.VITE_POSTS_URL;
            const res = await fetch(postsUrl, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ title, text })
                }
            );

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.data?.message || data.message || "Registration failed");
            }

            setSuccess(true);
            setTimeout(() => navigate("/"), 1500);

        } catch(err){
            console.error(err);
            setError(err.message);
        } finally{
            setLoading(false);
        }
    }
    return(
        <>
            <Container maxWidth="xs">
                <Box sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Typography component="h1">
                        Create a new post.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{mt:2, width:"100%"}}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{mt:2, width:"100%"}}>
                            Post created successfully! Redirecting...
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
                            Post created successfully! Redirecting to main page...
                        </Alert>
                    )}

                    <Box component='form' onSubmit={handleSubmit} sx={{mt: 3}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                        />

                        <TextField 
                            margin = 'normal'
                            required
                            fullWidth
                            multiline
                            label="Post Text"
                            value = {text} 
                            disabled={loading}
                            onChange={(e) => setText(e.target.value)}
                            maxRows={10}
                            inputProps={{maxLength: 150}}
                            helperText={`${text.length} / ${CHARACTER_LIMIT}`}
                            />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            disabled={loading}
                        >
                            {loading ? "Creating Post..." : "Add Post"}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>

    )
}