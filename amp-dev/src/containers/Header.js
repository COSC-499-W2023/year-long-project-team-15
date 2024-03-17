import React, { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from "../hooks/useCurrentUser";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUserName } = useCurrentUser();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountClick = () => {
    handleClose(); // Close the account menu
    navigate('/accountpage');
  };

  const handleSignOutClick = async () => {
    handleClose(); // Close the account menu
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="collapse navbar-collapse" id="navbarText" style={{ color: "white" }}>
        <button type="button" className="btn bg-dark" onClick={() => navigate('/')} style={{ marginRight: 'auto' }}>
          <h2 style={{ color: "white", margin: 0 }}>BlurVid</h2>
        </button>
        <ul className="navbar-nav" style={{ display: 'flex', alignItems: 'center' }}>
          <li className="nav-item">
            <span className="nav-link" style={{ color: "white" }}>{currentUserName ? currentUserName : "Loading..."}</span>
          </li>
          <li className="nav-item">
            <button 
              id="notification" 
              type="button" 
              className="btn" 
              onClick={handleNotificationClick}
              aria-controls="notification-menu"
              aria-haspopup="true"
              aria-expanded={notificationOpen ? 'true' : undefined}
            >
              <NotificationsIcon style={{ color: "white", fontSize: 30 }} />
            </button>
            <Menu
              id="notification-menu"
              anchorEl={notificationAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={notificationOpen}
              onClose={handleNotificationClose}
            >
              {/* Add notification items here */}
              <MenuItem onClick={handleNotificationClose}>Notification 1</MenuItem>
              <MenuItem onClick={handleNotificationClose}>Notification 2</MenuItem>
            </Menu>
          </li>
          <li className="nav-item">
            <button 
              id="account" 
              type="button" 
              className="btn" 
              onClick={handleMenu}
              aria-controls="menu-appbar"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <AccountCircleIcon style={{ color: "white", fontSize: 40 }} />
            </button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleAccountClick}>Account</MenuItem>
              <MenuItem onClick={handleSignOutClick}>Logout</MenuItem>
            </Menu>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
