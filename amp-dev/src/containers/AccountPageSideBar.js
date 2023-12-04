import React, { useState, useEffect, useContext} from 'react';
import client from '../apolloClient';
import { gql } from '@apollo/client';
import { List, ListItemButton, ListItemText, TextField, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import Button from '../components/Button';
import AcceptButton from '../components/AcceptButton';
import DeclineButton from '../components/Button.js';
import Header from "../containers/Header";

import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries'; // Correct import for listUsers
import { createFriendRequest } from '../graphql/mutations'; // Keep your mutation imports as is
import { friendRequestsBySenderID, friendRequestsByReceiverID, getUser,getFriendRequest } from '../graphql/queries';
import FriendContext from '../context/FriendContext.js';

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

  
    const [searchTerm, setSearchTerm] = useState('');
    const [friendsData, setFriendsData] = useState([]);

    useEffect(() => {
        const fetchFriendsData = async () => {
          try {
            const authenticatedUser = await Auth.currentAuthenticatedUser();
            const userId = authenticatedUser.attributes.sub;
    
            // Fetch pending requests
            const [sentRequestsResponse, receivedRequestsResponse] = await Promise.all([
              client.query({
                query: gql(friendRequestsBySenderID),
                variables: { senderID: userId, filter: { status: { eq: "Pending" } } }
              }),
              client.query({
                query: gql(friendRequestsByReceiverID),
                variables: { receiverID: userId, filter: { status: { eq: "Pending" } } }
              })
            ]);
    
            // Process friend requests to create friends list
            const combinedFriends = await processFriendRequests(
              sentRequestsResponse.data.friendRequestsBySenderID.items,
              receivedRequestsResponse.data.friendRequestsByReceiverID.items
            );
            setFriendsData(combinedFriends);
    
          } catch (error) {
            console.error("Error fetching user data with Apollo Client", error);
          }
        };
    
        fetchFriendsData();
      }, []);
    
      const processFriendRequests = async (sentRequests, receivedRequests) => {
        const friendIds = new Set(sentRequests.map(request => request.receiverID));
        receivedRequests.forEach(request => friendIds.add(request.senderID));
      
        const friendDetailsPromises = Array.from(friendIds).map(friendId =>
          client.query({
            query: gql(getUser),
            variables: { id: friendId },
            fetchPolicy: 'network-only'
          })
        );
      
        try {
          const friendDetailsResponses = await Promise.all(friendDetailsPromises);
          return friendDetailsResponses.map(response => response.data.getUser);
        } catch (error) {
          console.error("Error fetching friend details:", error);
          return [];
        }
      };
      const handleSignOut = async () => {
        try {
          await Auth.signOut(); // Sign out the user
          // You may want to redirect the user to a sign-in page or perform other actions after sign-out.
        } catch (error) {
          console.error("Error signing out:", error);
        }
      };
    
      const filteredFriends = friendsData.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const handleSearchChange2 = (event) => {
        setSearchTerm(event.target.value);
      };
    
      const { setSelectedFriend } = useContext(FriendContext);
    
      const handleFriendClick = (friend) => {
        console.log("Friend clicked:", friend);
        setSelectedFriend(friend); // Update the context with the selected friend
      };
    
  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
       
      <form className="d-flex" role="search" style={{ padding: "0.5em" }}>
         <h2>Pending Friend Requests</h2>   
      </form>
          
      <List>
        
      {filteredFriends.map(friend => (
          <ListItemButton key={friend.id} onClick={() => handleFriendClick(friend)}>
            <ListItemText primary={friend.name} />

            <AcceptButton
          label="Accept"
          onClick={null}
          className="btn btn-success"
        />
            <DeclineButton
          label="Decline"
          onClick={null}
          className="btn btn-danger"
        />

          </ListItemButton>
        ))}
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
      
      <div className="mt-auto p-2"> {/* Logout button pushed to bottom */}
          <Button
            label="LogOut"
            onClick={handleSignOut}
            className="btn btn-secondary"
          />
        </div>
    </div>
  );
}

export default AccountPageSidebar;


