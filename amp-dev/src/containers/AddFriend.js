import React, { useState, useEffect } from 'react';
import client from '../apolloClient';
import { gql } from '@apollo/client';
import { listFriendRequests, listUsers } from '../graphql/queries'; 
import { createFriendRequest } from '../graphql/mutations';
import SearchBar from '../components/SearchBar';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { ListItem, List, Box, Button } from '@mui/material';

const AddFriend = () => {
  const { currentUserId } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [potentialFriends, setPotentialFriends] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await client.query({
        query: gql(listUsers),
        fetchPolicy: 'network-only' 
      });
      setUsers(data.listUsers.items);
    };


    const fetchFriendRequests = async (currentUserId) => {
      // Fetch sent friend requests
      const { data: sentRequestsData } = await client.query({
        query: gql(listFriendRequests),
        variables: { filter: { senderID: { eq: currentUserId } } },
        fetchPolicy: 'network-only',
      });
    
      // Fetch received friend requests
      const { data: receivedRequestsData } = await client.query({
        query: gql(listFriendRequests),
        variables: { filter: { receiverID: { eq: currentUserId } } },
        fetchPolicy: 'network-only',
      });
    
      // Combine the results
      const combinedRequests = [
        ...sentRequestsData.listFriendRequests.items,
        ...receivedRequestsData.listFriendRequests.items,
      ];
      return combinedRequests;
    };

    const filterPotentialFriends = async () => {
      const friendRequests = await fetchFriendRequests();
      const friendIds = new Set(friendRequests.flatMap(req => [req.senderID, req.receiverID]));
      fetchUsers().then(() => {
        setPotentialFriends(users.filter(user => !friendIds.has(user.id) && user.id !== currentUserId));
      });
    };

    if (currentUserId) {
      filterPotentialFriends();
    }
  }, [currentUserId, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSendFriendRequest = async (receiverID) => {
    try {
      await client.mutate({
        mutation: gql(createFriendRequest),
        variables: {
          input: {
            senderID: currentUserId,
            receiverID: receiverID,
            status: 'Pending',
            date: new Date().toISOString(),
          }
        }
      });
      alert('Friend request sent!');

      setPotentialFriends(potentialFriends.filter(user => user.id !== receiverID));
     
      
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const filteredUsers = potentialFriends.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <List>
            {filteredUsers.map(user => (
                <ListItem key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{user.name}</span>
                        <Box>
                            <Button 
                              onClick={() => handleSendFriendRequest(user.id)} 
                              variant="contained" 
                              color="primary"
                              size="small"
                              style={{ marginRight: 8 }}
                            >
                                Add Friend
                            </Button>
                        </Box>
                    </Box>
                </ListItem>
            ))}
        </List>
    </div>
);
};


export default AddFriend;
