import React, { useState, useEffect, useContext } from 'react';
import client from '../apolloClient';
import { gql } from '@apollo/client';
import { List, ListItemButton, ListItemText } from '@mui/material';
import Auth from '@aws-amplify/auth';
import { friendRequestsBySenderID, friendRequestsByReceiverID, getUser } from '../graphql/queries';
import Button from '../components/Button.js';
import FriendContext from '../context/FriendContext.js';


const Sidebar = ({ testFilteredFriends }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsData, setFriendsData] = useState([]);

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const userId = authenticatedUser.attributes.sub;

        // Fetch sent and received friend requests
        const [sentRequestsResponse, receivedRequestsResponse] = await Promise.all([
          client.query({
            query: gql(friendRequestsBySenderID),
            variables: { senderID: userId, filter: { status: { eq: "Accepted" } } }
          }),
          client.query({
            query: gql(friendRequestsByReceiverID),
            variables: { receiverID: userId, filter: { status: { eq: "Accepted" } } }
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
//schema not curenntly supporting array query (in)
//   const processFriendRequests = async (sentRequests, receivedRequests) => {
//     // Extract unique user IDs from friend requests
//     const friendIds = new Set(sentRequests.map(request => request.receiverID));
//     receivedRequests.forEach(request => friendIds.add(request.senderID));

//     // Use listUsers query to fetch details for all friends
//     try {
//       const friendsResponse = await client.query({
//         query: gql(listUsers),
//         variables: { filter: { id: { in: Array.from(friendIds) } } }
//       });
//       return friendsResponse.data.listUsers.items;
//     } catch (error) {
//       console.error("Error fetching friend details:", error);
//       return [];
//     }
//   };

  const filteredFriends = testFilteredFriends 
  ? testFilteredFriends.filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : friendsData.filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const { setSelectedFriend } = useContext(FriendContext);

  const handleFriendClick = (friend) => {
    console.log("Friend clicked:", friend);
    setSelectedFriend(friend); // Update the context with the selected friend
  };

  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column" > {/* Flex container */}
      <form id="search-bar" className="d-flex" role="search" style={{ padding: "0.5em" }}>
        <input 
          className="form-control me-2" 
          type="search" 
          placeholder="Search Contacts" 
          aria-label="Search" 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </form>
      <List>
        {filteredFriends.map(friend => (
          <ListItemButton   key={friend.id} onClick={() => handleFriendClick(friend)}>
            <ListItemText data-testid={`friend-${friend.id}`} primary={friend.name} />
          </ListItemButton>
        ))}
      </List>
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

export default Sidebar;
