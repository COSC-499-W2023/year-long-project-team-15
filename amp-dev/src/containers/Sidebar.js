import React, { useEffect, useState } from 'react';
import SidebarSkeleton from './SidebarSkeleton';
import FriendSearchAndList from './FriendSearchAndList';
import Modal from '../components/Modal'
import AddFriend from './AddFriend';
import AcceptButton from '../components/AcceptButton';
import useFriends from '../hooks/useFriends';

const Sidebar = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [ friendsData ] = useFriends();

  const handleAddFriendClick = () => {
    setShowAddFriend(true);
  };

  return (
    <SidebarSkeleton>
      <FriendSearchAndList friendsData={friendsData} showDeleteButtons={false} />
      <div className="mt-auto p-2">
        <AcceptButton label="Add Friends" onClick={handleAddFriendClick} />
      </div>
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)} modalName = "Add Contact">
        <AddFriend />
      </Modal>
    </SidebarSkeleton>
  );
};

export default Sidebar;