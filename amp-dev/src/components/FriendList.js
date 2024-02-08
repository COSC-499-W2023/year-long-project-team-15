
import React from 'react';
import { List, ListItemButton, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FriendList = ({ friends, onFriendClick, onDeleteFriend }) => (
  <List>
    {friends.map(friend => (
      <ListItemButton key={friend.id} onClick={() => onFriendClick(friend)} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <ListItemText primary={friend.name} />
        {onDeleteFriend && (
          <IconButton onClick={(e) => { e.stopPropagation(); onDeleteFriend(friend); }}>
            <DeleteIcon />
          </IconButton>
        )}
      </ListItemButton>
    ))}
  </List>
);

export default FriendList;
