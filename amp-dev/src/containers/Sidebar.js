
import React, { useState, useContext } from 'react';
import FriendList from '../components/FriendList';
import SearchBar from '../components/Searchbar';
import LogoutButton from '../components/LogoutButton';
import useFriends from '../hooks/useFriends';
import FriendContext from '../context/FriendContext';
import { signOut } from '../services/AuthService';

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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <FriendList friends={filteredFriends} onFriendClick={handleFriendClick} />
      <LogoutButton onSignOut={handleSignOut} />
    </div>
  );
};

export default Sidebar;
