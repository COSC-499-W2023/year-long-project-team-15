import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AcceptButton from '../components/AcceptButton';
import DeclineButton from '../components/DeclineButton';
import { useFriend } from '../context/FriendContext';

const FriendRequestsAccordion = ({ friendsData, updateFriendRequestStatus }) => {
  const { setSelectedFriend } = useFriend();

  const friendRequestCount = friendsData.length; // Calculate the count of friend requests

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Friend Requests {friendRequestCount > 0 && `(${friendRequestCount})`} {/* Display count if greater than 0 */}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {friendRequestCount > 0 ? (
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
