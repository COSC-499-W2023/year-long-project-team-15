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
import { createFriendRequest, acceptFriendRequest, declineFriendRequest } from '../graphql/mutations';
import { friendRequestsBySenderID, friendRequestsByReceiverID, getUser, getFriendRequest, listUsers} from '../graphql/queries';
import FriendContext from '../context/FriendContext.js';
import AddFriend from './AddFriend'; // Adjust the path based on your project structure
import Modal from '../components/Modal'; // Adjust the path based on your project structure

const AccountPageSidebar = () => {
  const navigate = useNavigate();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [email, setEmail] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsData, setFriendsData] = useState([]);
  const { setSelectedFriend } = useContext(FriendContext);

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const userId = authenticatedUser.attributes.sub;

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

  const handleSearchChange2 = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
        setShowAddFriend(true);
      } else {
        setSearchMessage('No user found with this email.');
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setSearchMessage('Error in searching for user.');
    }
  };

  const handleAcceptClick = async (friendRequestId) => {
    try {
      console.log('Accepting friend request:', friendRequestId);
      await API.graphql({
        query: acceptFriendRequest,
        variables: { friendRequestId },
      });
      console.log('Friend request accepted successfully!');
  
      // Handle success (e.g., update local state, refresh the component)
    } catch (error) {
      console.error('Error accepting friend request:', error);
      // Handle error
    }
  };
  const handleDeclineClick = async (friendRequestId) => {
    try {
      await API.graphql({
        query: declineFriendRequest,
        variables: { friendRequestId },
      });
  
      // Handle success (e.g., update local state, refresh the component)
    } catch (error) {
      console.error('Error declining friend request:', error);
      // Handle error
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


