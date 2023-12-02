import React from "react";
import { Box, Menu, Stack } from "@mui/material";
import { Outlet } from "react-router";
import MenuBar from "../MenuBar/MenuBar";


const Layout = () => {
    return ( 
    <Box sx={{ height: "100vh", background: "none"}}>
        <MenuBar />
        <Stack minHeight={"100vh"} justifyContent={"center"} alignItems={"center"}>
            
            <Outlet />
        </Stack>
       
    </Box>

    )
    
};

export default Layout;