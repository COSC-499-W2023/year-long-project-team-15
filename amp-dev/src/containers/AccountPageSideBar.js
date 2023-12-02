import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const AccountPageSidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the provided path
  };

  const handleAddFriendClick = () => {
    navigate('/addfriend'); // Navigate to the AddFriend component
  };

  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column" > {/* Flex container */}
      {/* If there's no search needed on AccountPageSidebar, remove this form */}
      <List>
        {/* Navigation items specific to account settings */}
        <ListItemButton onClick={() => handleNavigation('/accountpage')}>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/account/security')}>
          <ListItemText primary="Security" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/account/settings')}>
          <ListItemText primary="Settings" />
        </ListItemButton>
        {/* Add more navigation items as needed */}
      </List>
      <div className="mt-auto p-2"> {/* Push the button to the bottom */}
        <Button
          label="Add Friend"
          onClick={handleAddFriendClick}
          className="btn btn-secondary"
        />
      </div>
    </div>
  );
}

export default AccountPageSidebar;

