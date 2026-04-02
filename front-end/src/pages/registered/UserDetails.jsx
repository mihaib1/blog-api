import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Divider
} from "@mui/material";
import PostCard from "../../components/PostCard";

export default function UserDetails() {
    const { id } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getUserDetails() {
            try {
                setError("");
                setLoading(true);
                // Get user details
                const usersUrl = import.meta.env.VITE_USERS_URL;
                const token = localStorage.getItem("token");

                const userRes = await fetch(`${usersUrl}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` })
                    }
                });

                if (!userRes.ok) {
                    throw new Error("Failed to load user details");
                }
                
                const userData = await userRes.json();
                setUserDetails(userData.data.userDetails);

                // Get user's posts
                const postsUrl = import.meta.env.VITE_POSTS_URL;
                const postsRes = await fetch(postsUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!postsRes.ok) {
                    throw new Error("Failed to load posts");
                }

                const postsData = await postsRes.json();
                // Filter posts by user
                const filteredPosts = postsData.data.posts.filter(
                    post => post.createdByUserId === parseInt(id)
                );
                setUserPosts(filteredPosts);

            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load user details");
            } finally {
                setLoading(false);
            }
        }
        
        if (id) {
            getUserDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!userDetails) {
        return (
            <Container>
                <Alert severity="warning" sx={{ mt: 4 }}>
                    User not found
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                {/* User Profile Card */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="h3" component="div">
                                {userDetails.displayName || userDetails.username}
                            </Typography>

                            <Typography variant="subtitle1" color="textSecondary">
                                @{userDetails.username}
                            </Typography>

                            <Divider />

                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {userDetails.email}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body1">
                                        {userDetails.role}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Account Status
                                    </Typography>
                                    <Typography variant="body1">
                                        {userDetails.isAuthorized ? "✅ Authorized" : "❌ Not Authorized"}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Member Since
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(userDetails.createdOn).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
                                Last updated: {new Date(userDetails.modifiedOn).toLocaleDateString()}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

                {/* User's Posts Section */}
                <Box>
                    <Typography variant="h4" sx={{ mb: 3 }}>
                        Posts by {userDetails.displayName || userDetails.username}
                        <Typography variant="subtitle2" component="span" sx={{ ml: 1, color: "textSecondary" }}>
                            ({userPosts.length})
                        </Typography>
                    </Typography>

                    {userPosts.length === 0 ? (
                        <Alert severity="info">
                            This user hasn't posted anything yet.
                        </Alert>
                    ) : (
                        <Stack spacing={3}>
                            {userPosts.map((post) => (
                                <div key={post.id}>
                                    <PostCard
                                        title={post.title}
                                        text={post.text}
                                        id={post.id}
                                    />
                                </div>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
