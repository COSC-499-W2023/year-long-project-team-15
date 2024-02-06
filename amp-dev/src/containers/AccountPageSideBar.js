
import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useFriendRequests } from '../hooks/useFriendRequests';
import FriendRequestAccordion from './FriendRequestAccordion';
import Modal from '../components/Modal';
import AddFriend from './AddFriend';
import SidebarSkeleton from '../containers/SidebarSkeleton';
import AcceptButton from '../components/AcceptButton';
import ManageFriends from './ManageFriends';

const AccountPageSidebar = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const { currentUserId } = useCurrentUser();
  const { friendsData, fetchFriendRequests, updateFriendRequestStatus, setFriendsDataExternally } = useFriendRequests(currentUserId);

  const removeFriendFromList = (friendId) => {
    const updatedFriendsData = friendsData.filter(friend => friend.friendRequestId !== friendId);
    setFriendsDataExternally(updatedFriendsData); 
  
    fetchFriendRequests();
  };
  useEffect(() => {
    if (currentUserId) {
      fetchFriendRequests();
    }
  }, [currentUserId, fetchFriendRequests]);


  return (
    <SidebarSkeleton>
      <FriendRequestAccordion
        friendsData={friendsData}
        updateFriendRequestStatus={updateFriendRequestStatus}
      />
      <ManageFriends onFriendDeleted={removeFriendFromList}/>
      <AcceptButton label="Add Friends" onClick={() => setShowAddFriend(true)} />
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)} modalName="Add Contact">
        <AddFriend />
      </Modal>
    </SidebarSkeleton>
  );
};



export default AccountPageSidebar;
