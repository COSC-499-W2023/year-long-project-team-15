
import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';

const FriendList = ({ friends, onFriendClick }) => (
  <List>
    {friends.map(friend => (
      <ListItemButton key={friend.id} onClick={() => onFriendClick(friend)}>
        <ListItemText primary={friend.name} />
      </ListItemButton>
    ))}
  </List>
);

export default FriendList;
