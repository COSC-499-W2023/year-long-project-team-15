import React, { useState, useEffect, useContext } from 'react';
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
import { updateFriendRequest } from '../graphql/mutations';
import { friendRequestsBySenderID, friendRequestsByReceiverID, getUser, getFriendRequest, listUsers} from '../graphql/queries';
import FriendContext from '../context/FriendContext.js';
import AddFriend from './AddFriend'; // Adjust the path based on your project structure
import Modal from '../components/Modal'; // Adjust the path based on your project structure

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const userId = authenticatedUser.attributes.sub;

        setCurrentUserId(userId);

        const receivedRequestsResponse = await client.query({
          query: gql(friendRequestsByReceiverID),
          variables: { receiverID: userId, filter: { status: { eq: "Pending" } } }
        });

        const receivedFriends = await processFriendRequests(
          receivedRequestsResponse.data.friendRequestsByReceiverID.items,
          []
        );

        setFriendsData(receivedFriends);
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

  const handleSearchChange2 = (event) => {
    setSearchTerm(event.target.value);
  };

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

  // const handleAcceptClick = async (friendRequest) => {
  //   try {
  //     await client.mutate({
  //       mutation: gql(updateFriendRequest),
  //       variables: {
  //         input: {
  //           id: friendRequest.id,
  //           status: 'Accepted',
  //           date: new Date().toISOString(),
  //         }
  //       }
  //     });

  //     setFriendsData(prevFriendsData => prevFriendsData.filter(friend => friend.id !== friendRequest.senderID));

  //     setAcceptedFriend(friendRequest.sender.name);

  //     setTimeout(() => {
  //       setAcceptedFriend(null);
  //     }, 2000);

  //   } catch (error) {
  //     console.error("Error accepting friend request:", error);
  //   }
  // };

  const handleDeclineClick = async (friendRequest) => {
    try {
      // Fetch the current state of the friend request
      const { data } = await client.query({
        query: gql(getFriendRequest),
        variables: { id: friendRequest.id },
      });
  
      // Check if the item exists
      if (!data.getFriendRequest) {
        console.error('Friend request not found:', friendRequest.id);
        // Handle the case where the item is not found, e.g., show an error message
        return;
      }
  
      console.log('Existing friend request:', data.getFriendRequest);
  
      // Attempt to update the friend request status to 'Declined'
      const result = await client.mutate({
        mutation: gql(updateFriendRequest),
        variables: {
          input: {
            id: friendRequest.id,
            status: 'Declined',
            date: new Date().toISOString(),
            senderID: friendRequest.senderID,
            receiverID: friendRequest.receiverID,
          }
        }
      });
  
      console.log('Update result:', result);
  
      // Remove the declined friend request from the local state
      setFriendsData((prevFriendsData) =>
        prevFriendsData.filter((request) => request.id !== friendRequest.id)
      );
  
      alert(`Friend request from ${friendRequest.sender.name} declined!`);
    } catch (error) {
      console.error('Error declining friend request:', error);
  
      // Log the detailed error details
      console.error('Error details:', error.networkError.result.errors);
  
      // You can also log the existing state of the item for further analysis
      console.error('Existing state of friend request:', friendRequest);
    }
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
              onClick={() => handleAcceptClick(friend)}
              className="btn btn-success"
            />
            <DeclineButton
              label="Decline"
              onClick={() => handleDeclineClick(friend)}
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



