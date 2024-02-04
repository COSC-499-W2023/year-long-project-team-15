import React, { useState, useContext } from 'react';
import FriendList from '../components/FriendList';
import SearchBar from '../components/SearchBar';
import useFriends from '../hooks/useFriends';
import FriendContext from '../context/FriendContext';
import Modal from '../components/Modal';
import AddFriend from './AddFriend';
import AcceptButton from '../components/AcceptButton';

const Sidebar = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const friendsData = useFriends();
  const { setSelectedFriend } = useContext(FriendContext);

  const handleAddFriendClick = () => {
    setShowAddFriend(true);
  };

  const filteredFriends = friendsData.filter(friend =>
    friend && friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <FriendList friends={filteredFriends} onFriendClick={handleFriendClick} />
      <div className="mt-auto p-2">
        <AcceptButton label="Add Friend" onClick={handleAddFriendClick} />
      </div>
      <Modal show={showAddFriend} onClose={() => setShowAddFriend(false)} modalName = "Add Contact">
        <AddFriend />
      </Modal>
    </div>
  );
};

export default Sidebar;