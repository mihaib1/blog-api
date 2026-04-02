import { useEffect, useState } from "react";
import { Container, Box, Typography, Stack } from "@mui/material";
import UserCard from "../../components/UserCard";

export default function AdminPage() {
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [page, setPage] = useState(0);

    useEffect(() => {
        async function getUserList(){
            try{
                setError(false);
                setLoading(true);
                let userUrl = import.meta.env.VITE_USERS_URL;
                /*if(cursor){
                    userUrl = userUrl + `?cursor=${cursor}`;
                    // aici ar trebui sa setez si pagina (dar cum?)
                } */
                const res = await fetch(userUrl,
                    {
                        method: "GET",
                        headers:{
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                        }
                    }
                );
                if(!res.ok) throw new Error(response.status === 403 ? "You don't have admin access" : "Failed to load users");
                
                const response = await res.json();
                if(response.success && response.data?.users){
                    setUserList(response.data.users);
                }
                if(response.data?.nextCursor){
                    setCursor(response.data.nextCursor.id);
                }
            }
            catch(err){
                setError(true);
                console.error(err);
            }
            finally{
                setLoading(false);
                console.log("finally block")
            }
        }

        getUserList();
    }, []);

    return(
        <>
            <Container maxWidth="100%">
                <Box sx={{
                    marginTop: "10",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "100%"
                }}>
                    <Typography variant="h3" style={{marginTop: "0.5em"}}>
                        User List (Admin Page)
                    </Typography>
                    {error && <Typography variant="body1" style={{mt: 2}}>There has been an error getting the user list. Please try again later!</Typography>}
                    {!error && userList.length > 0 && <Typography variant="body1">Here is a list of the users</Typography>}
                    {loading && <p>Loading...</p>}
                    <Box sx={{width:"100%", mt:5}} alignItems="center">
                        <Stack spacing={2} direction="row" useFlexGap="true" sx={{flexWrap: "wrap"}} alignItems="center" justifyContent="center">
                            {userList.length > 0 && userList.map((user) => (
                                
                                <div key={user.id}>
                                    <UserCard id={user.id}
                                    displayname={user.displayname}
                                    username={user.username}
                                    isAuthorized={user.isAuthorized} />
                                </div>
                            ))}
                            {userList.length == 0 && <p>There are no registered users</p>}
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </>
    );
}