import React, { useState, useEffect } from 'react';
import client from '../apolloClient';
import { List, ListItemButton, ListItemText } from '@mui/material';
import Auth from '@aws-amplify/auth';
import { friendRequestsBySenderID, friendRequestsByReceiverID, listUsers } from '../graphql/queries';

const Sidebar = () => {
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
            query: friendRequestsBySenderID,
            variables: { senderID: userId, filter: { status: { eq: "Accepted" } } }
          }),
          client.query({
            query: friendRequestsByReceiverID,
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
    // Extract unique user IDs from friend requests
    const friendIds = new Set(sentRequests.map(request => request.receiverID));
    receivedRequests.forEach(request => friendIds.add(request.senderID));

    // Use listUsers query to fetch details for all friends
    try {
      const friendsResponse = await client.query({
        query: listUsers,
        variables: { filter: { id: { in: Array.from(friendIds) } } }
      });
      return friendsResponse.data.listUsers.items;
    } catch (error) {
      console.error("Error fetching friend details:", error);
      return [];
    }
  };

  const filteredFriends = friendsData.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFriendClick = (friend) => {
    console.log("Friend clicked:", friend);
    // Implement logic for updating the main window 
  };


  return (
    <div className="container-fluid">
      <div className='row'>
        <div className="col-3 col-auto min-vh-100 bg-body-secondary">
          <form className="d-flex" role="search" style={{ padding: "0.5em" }}>
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search Contacts" 
              aria-label="Search" 
              value={searchTerm} 
              onChange={handleSearchChange} 
            />
            <button className="btn btn-secondary" type="submit">Search</button>
          </form>
          <List>
            {filteredFriends.map(friend => (
              <ListItemButton key={friend.id} onClick={() => handleFriendClick(friend)}>
                <ListItemText primary={friend.name} />
              </ListItemButton>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
