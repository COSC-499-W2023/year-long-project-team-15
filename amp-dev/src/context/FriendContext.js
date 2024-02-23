
import React, { createContext, useContext, useState, useEffect } from 'react';

const FriendContext = createContext();


function usePersistedContext(defaultValue, key) {
  const [state, setState] = useState(() => {
    const persistedValue = localStorage.getItem(key);
    return persistedValue !== null ? JSON.parse(persistedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}


export const FriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = usePersistedContext(null, 'selectedFriend');

  const clearFriendContext = () => {
    localStorage.removeItem('selectedFriend'); 
    setSelectedFriend(null); 
  };
  

  return (
    <FriendContext.Provider value={{ selectedFriend, setSelectedFriend, clearFriendContext }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => useContext(FriendContext);
