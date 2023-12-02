import React, { useRef, useContext, useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Link } from "@mui/material";
import { AuthContext } from '../../context/AuthContext';



const Login = () => {

    const email = useRef();
    const password = useRef();
    let { loginUser } = useContext(AuthContext);
   

    let handleLogin = () => {
        var email1=email.current.value;
        if(email1.length <= 0)
        {
            console.log("Empty Email");
            return;
        }
        var password1=password.current.value;
        if(password1.length <= 0){
            console.log("Empty Password");
            return;
        }

        loginUser(email1, password1);
        
        
    }


    return (
    <Box width = "50%" height = "50vh" sx = {{background: "white", borderRadius: "10px"}}>
        <Stack  gap={2}
        height={"100%"}
        justifyContent={"center"} 
        alignItems={"center"}>
        <Typography fontSize={"20px"} fontWeight={"bold"}>
            Login to your account
        </Typography>
        <Box>
            <TextField inputRef={email} size="small" label={"Email"} type="email"/>
        </Box>
        <Box>
            <TextField inputRef={password} size="small" label={"Password"} type="password"/>
        </Box>
        <Box textAlign={"center"}>
            <Link sx={{textDecoration: "none"}} href={"/signup"}>Create account</Link>
        </Box>
        <Button variant='contained' onClick={()=>handleLogin()}>Login</Button>
        </Stack>
    </Box>
    
    );
}


export default Login;