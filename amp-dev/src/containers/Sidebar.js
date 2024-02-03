import React, { useState, useContext } from 'react';
import FriendList from '../components/FriendList';
import SearchBar from '../components/SearchBar';
import useFriends from '../hooks/useFriends';
import FriendContext from '../context/FriendContext';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const friendsData = useFriends();
  const { setSelectedFriend } = useContext(FriendContext);

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
    </div>
  );
};

export default Sidebar;