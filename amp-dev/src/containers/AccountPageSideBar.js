import React, { useState, useEffect, useContext } from 'react';
import client from '../apolloClient';
import { gql, useMutation } from '@apollo/client';
import { List, ListItemButton, ListItemText, TextField, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
/*import Auth from '@aws-amplify/auth';*/
import { Auth } from 'aws-amplify';
import Button from '../components/Button';
import AcceptButton from '../components/AcceptButton';
import DeclineButton from '../components/Button.js';
import Header from "../containers/Header";

import { API, graphqlOperation } from 'aws-amplify';
import { createFriendRequest, AcceptFriendRequest, declineFriendRequest,updateFriendRequest } from '../graphql/mutations';
import { listFriendRequests, friendRequestsBySenderID, friendRequestsByReceiverID, getUser, getFriendRequest, listUsers} from '../graphql/queries';
import FriendContext from '../context/FriendContext.js';
import AddFriend from './AddFriend'; 
import Modal from '../components/AddFriendModal.js'; 

const AccountPageSidebar = () => {
  const navigate = useNavigate();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsData, setFriendsData] = useState([]);
  const [acceptedFriend, setAcceptedFriend] = useState(null);
  const [declinedFriend, setDeclinedFriend] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // New state variable
  const { setSelectedFriend } = useContext(FriendContext);
  const [currentUser, setCurrentUser] = useState(null);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const friendRequestsResponse = await client.query({
          query: gql(listFriendRequests),
          variables: {
            filter: { status: { eq: "Pending" } },
          },
        });
  
        const friendRequests = friendRequestsResponse.data.listFriendRequests.items;
  
        // Now you have a list of all pending friend requests
        console.log("Friend Requests:", friendRequests);
  
        const receivedFriends = await processFriendRequests(
          friendRequests,
          []
        );
  
        setFriendsData(receivedFriends);

          
        Auth.currentAuthenticatedUser()
        .then(user => {
          console.log('Current User:', user);
          setCurrentUser(user);
          setCurrentUserId(user.attributes.sub);

          
        })
        .catch(err => console.error('Error fetching current user:', err));
    

      } catch (error) {
        console.error("Error fetching user data with Apollo Client", error);
      }
      
    };
  
    fetchUserData();
  }, []);
  
  
  const processFriendRequests = async (receivedRequests) => {
    const friendIds = new Set(
      receivedRequests
        .filter(request => request.senderID !== currentUserId)
        .map(request => request.senderID)
    );

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

  // const handleSearchChange2 = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const filteredFriends = friendsData.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleAddFriendClick = () => {
    setShowAddFriend(true);
    setSearchMessage('');
    setSearchResults(null);
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  const handleAcceptClick = async (friendRequestId) => {
    console.log('Friend ID:', friendRequestId);
    try {
      console.log('Checkpoint 0 reached! Current User Id:', currentUserId);
      const input = {
        senderID: friendRequestId,
        receiverID: currentUserId,
        status: 'Accepted',
        //date: new Date().toISOString(),
      };
      console.log('Checkpoint 1 reached! Current Data:', input);

      const response = await API.graphql(graphqlOperation(updateFriendRequest, { input,  senderID = friendRequestId && receiverID = currentUserId}));

      if (response.errors && response.errors.length > 0) {
        // Log GraphQL errors
        response.errors.forEach(error => {
          console.error('GraphQL error:', error.message);
        });
  
      } else {console.log('Checkpoint #2 Reached');}
    } catch (error) {
      console.error('Error accepting friend request:', error);
      // Handle error
    }
  };


  const handleDeclineClick = async (friendRequestId) => {
    console.log('Friend ID:', friendRequestId);
    /*try {
      const response = await updateFriendRequestMutation({
        variables: {
          input: {
            id: friendRequestId,
            status: "Declined",
          },
        },
      });

      console.log('Friend request accepted successfully!', response.data.updateFriendRequest);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      // Handle error
    }
    */
  }


  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
      <form className="d-flex" role="search" style={{ padding: "0.5em" }}>
        <h2> Friend Requests</h2>
      </form>
      <List>
        {filteredFriends.map(friend => (
          <ListItemButton key={friend.id} onClick={() => handleFriendClick(friend)}>
            <ListItemText primary={friend.name} />
            <AcceptButton
              key={friend.id}
              label="Accept"
              onClick={() => handleAcceptClick(friend.id)}
              className="btn btn-success"
            />
            <DeclineButton
              label="Decline"
              onClick={() => handleDeclineClick(friend.id)}
              className="btn btn-danger"
            />
          </ListItemButton>
        ))}
      </List>

      {acceptedFriend && (
        <div className="popup-message">
          You added {acceptedFriend}!
        </div>
      )}

      {declinedFriend && (
        <div className="popup-message">
          You declined {declinedFriend}'s request!
        </div>
      )}

      <div className="mt-auto p-2">
        <Button
          label="Add Friend"
          onClick={handleAddFriendClick}
          className="btn btn-secondary"
        />
      </div>
      <div className="mt-auto p-2">
        <Button
          label="LogOut"
          onClick={handleSignOut}
          className="btn btn-secondary"
        />
      </div>
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)}>
        <AddFriend />
      </Modal>
    </div>
  );
}

export default AccountPageSidebar;



