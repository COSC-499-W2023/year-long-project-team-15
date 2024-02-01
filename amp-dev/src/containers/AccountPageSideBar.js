import React, { useState, useEffect, useContext } from 'react';
import client from '../apolloClient';
import { gql, useMutation } from '@apollo/client';
import { List, ListItem, ListItemText, TextField, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
/*import Auth from '@aws-amplify/auth';*/
import Auth from '@aws-amplify/auth';
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
  const [updateRequest, { data, loading, error }] = useMutation(gql(updateFriendRequest));


  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const user = authenticatedUser.attributes.sub;
        setCurrentUserId(authenticatedUser.attributes.sub);

        console.log("current user ID:", user);


        const friendRequestsResponse = await client.query({
          query: gql(friendRequestsByReceiverID),
          variables: {
            receiverID: user,
            filter: { status: { eq: "Pending" }}
            
          }
        });

        const friendRequests = friendRequestsResponse.data.friendRequestsByReceiverID.items;
  
        // Now you have a list of all pending friend requests
        console.log("Friend Requests:", friendRequests);
  
        const receivedFriends = await processFriendRequests(
          friendRequests
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
        .map(request => request.senderID)
    );

    const friendDetailsPromises = Array.from(friendIds).map(friendId =>
      client.query({
        query: gql(getUser),
        variables: { id: friendId }
        
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

  const fetchFriendRequestId = async (senderId, receiverId) => {
    try {
      const response = await client.query({
        query: gql(friendRequestsByReceiverID),
        variables: {
          receiverID: receiverId,
          filter: { senderID: { eq: senderId }, status: { eq: "Pending" } },
        },
        fetchPolicy: 'network-only'
      });
  
      const friendRequests = response.data.friendRequestsByReceiverID.items;
      if (friendRequests.length > 0) {
        // Assuming the first match is the correct one
        return friendRequests[0].id;
      }
    } catch (error) {
      console.error("Error fetching friend request ID:", error);
    }
    return null; // Return null if no matching friend request or on error
  };
  
  const handleUpdateFriendRequest = async (senderId, status) => {
    const friendRequestId = await fetchFriendRequestId(senderId, currentUserId);
    if (friendRequestId) {
      await updateFriendRequestStatus(friendRequestId, status, senderId);
  
      // Update the friendsData state to remove the accepted/declined request
      const updatedFriendsData = friendsData.filter(request => request.senderID !== senderId);
      setFriendsData(updatedFriendsData);
    } else {
      console.log(`No matching friend request found for ${status.toLowerCase()}.`);
    }
  };

  const updateFriendRequestStatus = async (friendRequestId, status, senderId) => {
    try {
      const input = { id: friendRequestId, status: status };
      const condition = {
        senderID: { eq: senderId },
        receiverID: { eq: currentUserId }
      };
  
      await updateRequest({
        variables: { input, condition },
        refetchQueries: [{ query: gql(friendRequestsByReceiverID), variables: { receiverID: currentUserId, filter: { status: { eq: "Pending" } } } }]
      });
  
      console.log(`Friend request ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error(`Error updating friend request to ${status}:`, error);
    }
  };
  
  
  

  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
      <form className="d-flex" role="search" style={{ padding: "0.5em" }}>
        <h2> Friend Requests</h2>
      </form>
      <List>
        {friendsData.filter(friend => friend.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(friend => (
          <ListItem key={friend.id} onClick={() => handleFriendClick(friend)}>
            <ListItemText primary={friend.name} />
            <AcceptButton
              key={friend.id}
              label="Accept"
              onClick={() => handleUpdateFriendRequest(friend.id, "Accepted")}
              className="btn btn-success"
            />
            <DeclineButton
              label="Decline"
              onClick={() => handleUpdateFriendRequest(friend.id, "Declined")}
              className="btn btn-danger"
            />
          </ListItem>
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



