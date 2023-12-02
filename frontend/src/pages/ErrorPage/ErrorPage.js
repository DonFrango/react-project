import React from "react";  
import { Typography, Stack, Link } from "@mui/material";
import "../../components/Css/global.css";


const ErrorPage = () => {
    return (
        <Stack gap={1} alignItems={"center"}>
            <Typography fontSize={"50px"}>404</Typography>
            <Typography>
                Page doesn't exist!!
            </Typography>
            <Link sx={{ textDecoration: "none" }} href="/login">Go to Login
            </Link>
        </Stack>
    ) 
    
}

export default ErrorPage;