import React, { useState, useContext, useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { List, ListItem, ListItemText } from '@mui/material';
import AcceptButton from '../components/AcceptButton'; 
import DeclineButton from '../components/DeclineButton';
import FriendContext from '../context/FriendContext';
import Modal from '../components/Modal';
import AddFriend from '../containers/AddFriend';

const AccountPageSidebar = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const { setSelectedFriend } = useContext(FriendContext);
  const { currentUserId } = useCurrentUser();
  const { friendsData, fetchFriendRequests, updateFriendRequestStatus } = useFriendRequests(currentUserId);

  const handleFriendClick = friend => {
    setSelectedFriend(friend);
  };

  const handleAddFriendClick = () => {
    setShowAddFriend(true);
  };

  // Fetch friend requests on component mount and when currentUserId changes
  useEffect(() => {
    console.log("current user:", currentUserId);
    if (currentUserId) {
     
      fetchFriendRequests();
    }
  }, [currentUserId, fetchFriendRequests]);

  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
      <h2>  Friend Requests</h2>
      <List>
        {friendsData.map(friend => (
          <ListItem key={friend.id} onClick={() => handleFriendClick(friend)}>
            <ListItemText primary={friend.name} />
            <AcceptButton
              label="Accept"
              onClick={() => updateFriendRequestStatus(friend.friendRequestId, "Accepted")}
            />
            <DeclineButton
              label="Decline"
              onClick={() => updateFriendRequestStatus(friend.friendRequestId, "Declined")}
            />
          </ListItem>
        ))}
      </List>
      <div className="mt-auto p-2">
        <AcceptButton label="Add Friend" onClick={handleAddFriendClick} />
      </div>
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)} modalName = "Add Contact">
        <AddFriend />
      </Modal>
      
    </div>
  );
};



export default AccountPageSidebar;
