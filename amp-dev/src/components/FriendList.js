import React from 'react';
import { List, ListItemButton, ListItemText, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFriend } from '../context/FriendContext';

const FriendList = ({ friends, onFriendClick, onDeleteFriend }) => {
  const { selectedFriend } = useFriend();
  return (
  <Box sx={{ overflowY: 'auto' }}>
    <List>
      {friends.map(friend => (
        <ListItemButton 
          key={friend.id} 
          onClick={() => onFriendClick(friend)}
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            backgroundColor: friend.id === selectedFriend?.id ? '#f1f1f1' : 'transparent',
            '&:hover': {
              backgroundColor: friend.id === selectedFriend?.id ? '#f0f0f0' : '#e0e0e0',
            },
          }}
        >
          <ListItemText primary={friend.name} />
          {onDeleteFriend && (
            <IconButton onClick={(e) => { e.stopPropagation(); onDeleteFriend(friend); }}>
              <DeleteIcon />
            </IconButton>
          )}
        </ListItemButton>
      ))}
    </List>
  </Box>
)};
export default FriendList;
