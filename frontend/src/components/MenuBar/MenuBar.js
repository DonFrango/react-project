import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LogoutIcon from '@mui/icons-material/Logout';
import { purple, green, red, cyan, yellow } from '@mui/material/colors';
import { AuthContext } from "../../context/AuthContext";
import CreatePostModal from "../CreatePostModal";
import { Typography } from "@mui/material";



const  MenuBar = () => {
  
  let { logoutUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  


  return(

   <div>

    <input type="checkbox" id="check"></input>
    <label for="check" className="closebtn">
    <div>
      <div className="starsec"></div>
      <div className="starthird"></div>
      <div className="starfourth"></div>
      <div classNames="starfifth"></div>
    </div>
      <i id="btn"><MenuIcon/></i>
      <i id="cancel"><CloseIcon sx={{ color: red[500] }}/></i>
    </label>
    <div class="sidebar d-block">
    <header>
      <Link to="/home" className="navbar-brand menu-item">
        <HomeIcon sx={{ color: green[500] }}/><i></i> Home</Link>
    </header>
      <div> 
        <ul class="navigation__menu">
          <li><Link to="/account" >
          <PermIdentityIcon sx={{ color: purple[500] }}/>
            <i></i>Account</Link>
            </li>

          <li><Link to="#"><Typography onClick={handleOpen}> 
          <FolderOpenIcon sx={{ color: yellow[500] }} />
          <i></i>Upload New file</Typography> </Link>
          </li>
        <li><Link to="/" onClick={logoutUser}>
          <LogoutIcon sx={{ color: red[500] }}/>
          <i></i>Log Out</Link>
          </li>
        </ul>
     </div>
   </div>
   <CreatePostModal open={open} close={handleClose}/>
   </div>

  );
}

export default MenuBar;
