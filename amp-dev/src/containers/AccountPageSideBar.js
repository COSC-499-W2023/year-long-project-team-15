import React, { useState, useContext, useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { List, ListItem, ListItemText } from '@mui/material';
import Button from '../components/Button';
import AcceptButton from '../components/AcceptButton'; // Assuming distinct components
import DeclineButton from '../components/DeclineButton'; // Assuming distinct components
import FriendContext from '../context/FriendContext';
import Modal from '../components/AddFriendModal';
import { signOut } from '../services/AuthService';
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      
    }
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
      <h2> Friend Requests</h2>
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
        <Button label="Add Friend" onClick={handleAddFriendClick} />
      </div>
      <div className="mt-auto p-2">
        <Button label="LogOut" onClick={handleSignOut} />
      </div>
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)}>
        <AddFriend />
      </Modal>
    </div>
  );
};

export default AccountPageSidebar;
