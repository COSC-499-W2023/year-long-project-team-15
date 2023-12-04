import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, TextField, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Button from '../components/Button';
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries'; 
import { createFriendRequest } from '../graphql/mutations';
import client from '../apolloClient'; // Import Apollo Client
import { gql } from '@apollo/client';
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
      const userData = await client.query({
        query: gql(listUsers),
        variables: { filter },
        fetchPolicy: 'cache-first' // Prioritize cache, then network
      });
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
        senderID: currentUser.attributes.sub,
        receiverID: searchResults.id
      };
      await client.mutate({
        mutation: gql(createFriendRequest),
        variables: { input }
      });
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
            label="Enter Email"
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
        {/* ... Other buttons if needed ... */}
      </div>
    </div>
  );
}

export default AccountPageSidebar;


