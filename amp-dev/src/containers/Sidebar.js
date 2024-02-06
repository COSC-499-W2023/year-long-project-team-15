import React, { useState } from 'react';
import SidebarSkeleton from './SidebarSkeleton';
import FriendSearchAndList from './FriendSearchAndList';
import Modal from '../components/Modal'
import AddFriend from './AddFriend';
import AcceptButton from '../components/AcceptButton';

const Sidebar = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const handleAddFriendClick = () => {
    setShowAddFriend(true);
  };

  return (
    <SidebarSkeleton>
      <FriendSearchAndList showDeleteButtons={false} />
      <div className="mt-auto p-2">
        <AcceptButton label="Add Friend" onClick={handleAddFriendClick} />
      </div>
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)} modalName = "Add Contact">
        <AddFriend />
      </Modal>
    </SidebarSkeleton>
  );
};

export default Sidebar;