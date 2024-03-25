import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FriendSearchAndList from './FriendSearchAndList';
import { deleteFriendRequest } from '../graphql/mutations';
import { gql } from '@apollo/client';
import client from '../apolloClient';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { fetchSpecificFriendRequest } from '../services/FriendService';
import ConfirmationDialog from '../components/ConfirmDialog';
import { fetchFriendDetails } from '../services/FriendService';
import AddFriend from './AddFriend';
import { FriendProvider } from '../context/FriendContext';

const ManageFriends = ({ onFriendDeleted }) => {
    const [expanded, setExpanded] = useState(false);
    const { currentUserId } = useCurrentUser();
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingDeleteFriend, setPendingDeleteFriend] = useState({ id: null, name: "" });
   

    const handleDeleteFriend = async (friendId) => {
        try {
            const friendDetails = await fetchFriendDetails([friendId]);
            const friend = friendDetails[0]; 
            if (friend) {
                setPendingDeleteFriend({ id: friendId, name: friend.name }); 
                setConfirmDialogOpen(true);
            } else {
                console.error("No friend details found for ID:", friendId);
            }
        } catch (error) {
            console.error("Error fetching friend details:", error);
       }
    };
    

      const handleConfirmDelete = () => {
        if (pendingDeleteFriend.id) {
          handleDeleteFriendConfirmed(pendingDeleteFriend.id);
          setConfirmDialogOpen(false); 
          setPendingDeleteFriend({ id: null, name: "" }); 
        }
      };
            

    const handleDeleteFriendConfirmed = async (friendId) => {
      try {
          const requestIds = await fetchSpecificFriendRequest(currentUserId, friendId);
          if(requestIds.length === 1){
              await Promise.all(requestIds.map(id => 
                  client.mutate({
                    mutation: gql(deleteFriendRequest),
                    variables: { input: { id } },  
                  })
                ));
          }
          AddFriend();
        
        console.log("Friend request(s) deleted for user ID:", friendId);
        onFriendDeleted(friendId);
      } catch (error) {
        console.error("Error deleting friend request:", error);
      }
    };

return (
    <>
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>My Friends</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FriendSearchAndList showDeleteButtons={true} onDelete={handleDeleteFriend} />
      </AccordionDetails>
    </Accordion>
    <ConfirmationDialog
    open={confirmDialogOpen}
    onClose={() => setConfirmDialogOpen(false)}
    onConfirm={handleConfirmDelete}
    message={`Are you sure you want to remove ${pendingDeleteFriend.name}?`}
    />
    </>
  );
};

export default ManageFriends;
