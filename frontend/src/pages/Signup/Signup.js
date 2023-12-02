import React, { useRef, useContext, useState} from 'react';
import { Box, Button, Stack, TextField, Typography, Link } from "@mui/material";
import { AuthContext } from '../../context/AuthContext';


const Signup = () => {
    const email = useRef();
    const password = useRef();
    const name = useRef();
    const phone = useRef();
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    

    let {registerUser} = useContext(AuthContext);

    let handleRegister = () => {
        var email1=email.current.value;
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
        var password1=password.current.value;
        if(password1.length <= 0){
            console.log("Empty Password");
            setPasswordError(true);
            return;
        }
        var name1=name.current.value;
        if(name1.length <= 0){
            console.log("Empty Name");
            setNameError(true);
            return;
        }
        var phone1=phone.current.value;
        if(phone1.length <= 0){
            console.log("Empty Phone");
            setPhoneError(true);
            return;
        }
        registerUser(email1, password1, phone1, name1);
    };

    return (
    <Box width = "50%" height = "50vh" sx = {{background: "white", borderRadius: "10px"}}>
        <Stack  gap={2}
        height={"100%"}
        justifyContent={"center"} 
        alignItems={"center"}>
        <Typography fontSize={"20px"} fontWeight={"bold"}>
            Create your account
        </Typography>
        <Box>
            <TextField inputRef={email} size="small" label={"Email"} type="email" error={emailError} 
            helperText={emailError && "Invalid email"} />
        </Box>
        <Box>
            <TextField inputRef={password} size="small" label={"Password"} type="password" error={passwordError} 
            helperText={passwordError && "Invalid Password"}/>
        </Box>
        <Box>
            <TextField inputRef={name} size="small" label={"Name"} error={nameError} 
            helperText={nameError && "Invalid Name"}/>
        </Box>
        <Box>
            <TextField inputRef={phone} size="small" label={"Phone"} error={phoneError} 
            helperText={phoneError && "Invalid phone"}/>
        </Box>
        <Box textAlign={"center"}>
            <Link sx={{textDecoration: "none"}} href={"/login"}>Login to existing account</Link>
        </Box>
        <Button variant='contained' onClick={()=>handleRegister()} >Register</Button>
        </Stack>
    </Box>
    
    );
};


export default Signup;