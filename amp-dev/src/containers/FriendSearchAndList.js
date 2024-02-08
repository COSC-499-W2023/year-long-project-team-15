
import React, { useContext, useState } from 'react';
import FriendList from '../components/FriendList';
import SearchBar from '../components/SearchBar';
import useFriends from '../hooks/useFriends';
import FriendContext from '../context/FriendContext';

const FriendSearchAndList = ({ showDeleteButtons, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const friendsData = useFriends();
  const { setSelectedFriend } = useContext(FriendContext);

  const handleDeleteFriend = (friend) => {
    onDelete && onDelete(friend.id);
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
