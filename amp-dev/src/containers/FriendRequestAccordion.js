import React, { useContext } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AcceptButton from '../components/AcceptButton';
import DeclineButton from '../components/DeclineButton';
import FriendContext from '../context/FriendContext';

const FriendRequestsAccordion = ({ friendsData, updateFriendRequestStatus }) => {
  const { setSelectedFriend } = useContext(FriendContext);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Friend Requests</Typography>
      </AccordionSummary>
      <AccordionDetails>
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
      </AccordionDetails>
    </Accordion>
  );
};

export default FriendRequestsAccordion;
