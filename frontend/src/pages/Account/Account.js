import React, { useContext, useEffect, useRef, useState} from "react";
import { Stack, Box, TextField, Typography, Button, Card, Grid } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Post from "../../components/Post";



const Account = () =>  {
    let { user } = useContext(AuthContext); 
    const email = useRef();
    const oldPassword = useRef();
    const newPassword = useRef();
    const name = useRef();
    const phone = useRef();
    const [emailError, setEmailError] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [postsByCategory, setPostsByCategory] = useState([]);
    const [posts, setPosts] = useState([]);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    useEffect (() => {
        getUserPosts();
        getStatistics();
    }, []);

    let getUserPosts = () => {
        axios
        .get("http://localhost:8081/posts/user/" + user.id)
        .then((response)=> {
          console.log(response.data.posts);
          setPosts(response.data.posts);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    let getStatistics = async () => {
        axios
        .get("http://localhost:8081/statistics")
        .then((response)=> {
          console.log(response.data);
          setUserCount(response.data.users);
          setPostCount(response.data.posts);
          setPostsByCategory(response.data.categories);
         })
        .catch((error) => {
          console.log(error);
        })
        
    }

    let updateProfile = () => {
        var email1= email.current.value
        var old_password= oldPassword.current.value
        var new_password= newPassword.current.value
        var name1=name.current.value
        var phone1=phone.current.value

        if(email1.length <= 0)
        {
            console.log("Empty Email");
            return;
        }
        if(!emailRegex.test(email1)){
            console.log("Invalid Email");
            setEmailError(true);
            return;
        }  
        
        if(new_password.length <= 0){
            console.log("Empty Password");
            return;
        }
       
        if(name1.length <= 0){
            console.log("Empty Name");
            return;
        }
     
        if(phone1.length <= 0){
            console.log("Empty Phone");
            return;
        } 

        var raw={
            id: user.id,
            email: email1,
            name: name1,
            phone: phone1,
            old_password: old_password,
            new_password: new_password
            }

        console.log(raw);

        axios
        .post("http://localhost:8081/user/update",raw)
        .then((response) => {
            console.log(response);
         })
        .catch((error) => {
             console.log(error);
         });
    };

 return(
     <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={2}>
            </Grid>
          <Grid item xs={6}>
            <Stack gap={3} >
                {posts.map((post) =>(
                    <Post 
                    key={post.id}
                    post={post}
                    user={user}
                    posts={posts}
                    setPosts={setPosts}
                    page={"profile"}
                    />            
                ))}
            
            </Stack>
            </Grid>
       <Grid item xs={4} >
        <Stack gap={2} >
         <Stack  gap={2}
        marginRight={50}
        justifyContent={"center"} 
        alignItems={"center"}
        width={"50vh"}
        height={"50vh"}
        sx={{background: "white", borderRadius: "10px"}}>
         <Stack >
          <Typography fontSize={"20px"} 
          fontWeight={"bold"}>
              Update your Account info
          </Typography>
        </Stack>
        <Box>
            <TextField defaultValue={user.email}
            inputRef={email} 
            size="small" 
            label={"Email"} 
            type="email" 
            error={emailError} 
            helperText={emailError && "Invalid email"} />
        </Box>
        <Box>
            <TextField 
            inputRef={oldPassword} 
            size="small" 
            label={"Old Password"} 
            type="password" 
            />
        </Box>
        <Box>
            <TextField inputRef={newPassword} 
            size="small" 
            label={"New Password"} 
            type="password" 
            />
        </Box>
        <Box>
            <TextField 
            defaultValue={user.name}
            inputRef={name}
             size="small" 
             label={"Name"} 
             />
        </Box>
        <Box>
            <TextField 
            defaultValue={user.phone}
            inputRef={phone} 
            size="small" 
            label={"Phone"} 
            />
        </Box>
        <Button variant='contained'onClick={updateProfile}>Update</Button>
        </Stack>
        <Box width={"50%"}>
            <Card sx={{ padding: 2}}>
                <Stack gap={1}>
                    <Typography fontWeight={"bold"}> Statistics </Typography>
                    <Typography fontWeight={"bold"}> <b>Users</b> &nbsp; {userCount} </Typography>
                    <Typography fontWeight={"bold"}> <b>Posts</b> &nbsp; {postCount} </Typography>
                    <Typography fontWeight={"bold"}> Post by Category </Typography>
                    
                    {postsByCategory.map((item) => (
                        <Typography key={item.category}>
                            <b>{item.category}:</b>&nbsp;{item.count}
                         </Typography>
                    ))}
                </Stack>
            </Card>
        </Box>
        </Stack>
        </Grid>
        </Grid>
    </Box>
        
   
     
      
 )
}

export default Account;
