import React, { useState } from 'react';
import { gql } from '@apollo/client';
import client from '../apolloClient';
import { TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useFriend } from '../context/FriendContext';
import Modal from '../components/Modal';
import PictureUploadForm from './PictureUploadForm';
import VideoMessagesList from '../components/VideoMessageList';
import { createVideoMessage } from '../graphql/mutations';
import { useGetMessages } from '../hooks/useGetMessages';
import { useCurrentUser } from '../hooks/useCurrentUser';

const ChatView = () => {
  const { selectedFriend } = useFriend();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const { fetchMessages } = useGetMessages({ selectedFriend });
  const { currentUserId } = useCurrentUser();

  if (!selectedFriend) {
    return (
      <div className="col-9 col-auto">
        <h1 className="display-6">&emsp;Please select a friend to start chatting</h1>
      </div>
    );
  }
   
  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      const videoMessageResult = await client.mutate({
        mutation: gql(createVideoMessage),
        variables: {
          input: {
            senderID: currentUserId,
            receiverID: selectedFriend.id, 
            message,
            date: new Date().toISOString(),
          }
        },
      });
    

      console.log('message created:', videoMessageResult);
      fetchMessages();
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleShowModal = () => setShowModal(true); 
  const handleCloseModal = () => setShowModal(false); 

  return (
    <div className="col-9 col-auto d-flex flex-column">
      <div className="overflow-auto px-2 py-1 flex-grow-1">
        <div>
          <p>&emsp;Chatting with: {selectedFriend.name}</p>
        </div>
        <VideoMessagesList key={selectedFriend.id} selectedFriend={selectedFriend} />
      </div>
      <div className="d-flex align-items-center p-2 mt-auto">
        <TextField
          label="Type a message..."
          variant="outlined"
          className="flex-grow-1 me-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
        />
        <div> 
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon style={{ fontSize: 40 }}/>
          </IconButton>
          <IconButton color="secondary" onClick={handleShowModal}>
            <PhotoCameraIcon style={{ fontSize: 40 }}/>
          </IconButton>
        </div>
      </div>
      <Modal show={showModal} onClose={handleCloseModal} modalName="Blur Picture">
        <PictureUploadForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ChatView;
