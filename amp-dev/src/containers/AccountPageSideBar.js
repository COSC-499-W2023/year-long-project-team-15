
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
  const { friendsData, fetchFriendRequests, updateFriendRequestStatus } = useFriendRequests(currentUserId);

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
      <ManageFriends />
      <AcceptButton label="Add Contact" onClick={() => setShowAddFriend(true)} />
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)} modalName="Add Contact">
        <AddFriend />
      </Modal>
    </SidebarSkeleton>
  );
};



export default AccountPageSidebar;
