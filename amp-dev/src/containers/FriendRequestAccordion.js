import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AcceptButton from '../components/AcceptButton';
import DeclineButton from '../components/DeclineButton';
import { useFriend } from '../context/FriendContext';

const FriendRequestsAccordion = ({ friendsData, updateFriendRequestStatus }) => {
  const { setSelectedFriend } = useFriend();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Friend Requests</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {friendsData.length > 0 ? (
          <List>
            {friendsData.map(friend => (
              <ListItem key={friend.id} onClick={() => setSelectedFriend(friend)}>
                <ListItemText primary={friend.name} />
                <AcceptButton
                  label="Accept"
                  onClick={(e) => { e.stopPropagation(); updateFriendRequestStatus(friend.friendRequestId, "Accepted"); }}
                />
                <DeclineButton
                  label="Decline"
                  onClick={(e) => { e.stopPropagation(); updateFriendRequestStatus(friend.friendRequestId, "Declined"); }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            You have no friends requests.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default FriendRequestsAccordion;
