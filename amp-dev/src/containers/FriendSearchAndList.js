
import React, { useState } from 'react';
import FriendList from '../components/FriendList';
import SearchBar from '../components/SearchBar';
import { useFriend } from '../context/FriendContext';

const FriendSearchAndList = ({ friendsData = [], showDeleteButtons, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setSelectedFriend } = useFriend();

  const handleDeleteFriend = (friend) => {
    onDelete && onDelete(friend.id);
  };

  const filteredFriends = friendsData.filter(friend =>
    friend && friend?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <div>
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <FriendList 
        friends={filteredFriends} 
        onFriendClick={handleFriendClick} 
        onDeleteFriend={showDeleteButtons ? handleDeleteFriend : null} 
      />
    </div>
  );
};

export default FriendSearchAndList;
