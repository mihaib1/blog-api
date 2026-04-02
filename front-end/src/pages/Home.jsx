import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

import {
  Box,
  Container,
  Stack,
  Typography
} from "@mui/material";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getPosts() {
            try{
                setError("");
                setLoading(true);
                const postsUrl = import.meta.env.VITE_POSTS_URL;
                const res = await fetch(postsUrl, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        //"Authorization": sessionStorage.getItem("token")
                    },
                });
                if (!res.ok) throw new Error("Invalid credentials");

                const response = await res.json();
                setPosts(response.data.posts);
            }
            catch(err){
                console.error(err);
                setError(err);
            }
            finally{
                setLoading(false);
            }
        }
        
        getPosts()
    }, []);

  return (
    <>
        <Container maxWidth="100%">
            <Box sx={{
                marginTop: "10",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth:'100%'
                }}>
                    <Typography variant="h3" style={{marginTop:"0.5em"}}>
                        Home Page
                    </Typography>
                    {error && <Typography variant="body1" style={{mt: 2}}>There has been an error getting the posts. Please try again later!</Typography>}
                    {!error && posts && posts.length > 0 && <Typography variant="body1">Here is a list of the posts</Typography>}
                    {loading && <p>Loading</p>}
                    <Box sx={{width:'100%', mt:5}} alignItems="center">
                        <Stack spacing={2} direction="row" useFlexGap="true" sx={{flexWrap: "wrap"}} alignItems="center" justifyContent="center">
                        {posts.length > 0 && posts.map((post) => (
                            
                                <div key={post.id}>
                                    <PostCard 
                                    title={post.title}
                                    text={post.text}
                                    id={post.id}
                                    />
                                </div>
                            ))}
                        {
                            posts.length == 0 && <p>There is no post here</p>
                        }
                        </Stack>
                    </Box>
                    
        </Box>
            
        </Container>
    </>
  );
}