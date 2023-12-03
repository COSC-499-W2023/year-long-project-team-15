import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, TextField, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Button from '../components/Button';
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries'; // Correct import for listUsers
import { createFriendRequest } from '../graphql/mutations'; // Keep your mutation imports as is

// Import any additional required queries

const AccountPageSidebar = () => {
  const navigate = useNavigate();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [email, setEmail] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleAddFriendClick = () => {
    setShowAddFriend(!showAddFriend); // Toggle the add friend search input
    setSearchMessage(''); // Reset search message
    setSearchResults(null); // Reset search results
  };

  const handleSearchChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const filter = { email: { eq: email } };
      const userData = await API.graphql(graphqlOperation(listUsers, { filter }));
      if (userData.data.listUsers.items.length > 0) {
        setSearchResults(userData.data.listUsers.items[0]);
        setSearchMessage('User found!');
      } else {
        setSearchMessage('No user found with this email.');
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setSearchMessage('Error in searching for user.');
    }
  };

  const handleSendFriendRequest = async () => {
    if (!searchResults) return;
  try {
    const currentUser = await Auth.currentAuthenticatedUser();
    const input = {
      senderID: currentUser.attributes.sub, // Using the 'sub' attribute as the user ID
      receiverID: searchResults.id
    };
      await API.graphql(graphqlOperation(createFriendRequest, { input }));
      setSearchMessage('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      setSearchMessage('Error in sending friend request.');
    }
  };

  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
      <List>
        {/* ... List Items ... */}
      </List>

      {showAddFriend && (
        <div style={{ padding: '10px' }}>
          <TextField
            label="Friend's Email"
            type="email"
            fullWidth
            value={email}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            style={{ marginBottom: '10px' }}
          />
          <MuiButton
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Search
          </MuiButton>
          {searchResults && (
            <MuiButton
              variant="contained"
              color="secondary"
              onClick={handleSendFriendRequest}
              style={{ marginTop: '10px' }}
            >
              Send Friend Request
            </MuiButton>
          )}
          {searchMessage && <p>{searchMessage}</p>}
        </div>
      )}

      <div className="mt-auto p-2">
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


