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
import { v4 as uuidv4 } from 'uuid';
import FilterMessages from "../components/FilterMessages";

const ChatView = () => {
  const { selectedFriend } = useFriend();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const { messages, setAllMessages, loading, error, updateFilterCriteria} = useGetMessages({ selectedFriend });
  const { currentUserId } = useCurrentUser();

  const handleFilterChange = (criteria) => {
    updateFilterCriteria(criteria);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const uniqueKey = uuidv4();

    try {
      const videoMessageResult = await client.mutate({
        mutation: gql(createVideoMessage),
        variables: {
          input: {
            id: uniqueKey,
            senderID: currentUserId,
            receiverID: selectedFriend.id, 
            message,
            date: new Date().toISOString(),
          }
        },
      });

      console.log('message created:', videoMessageResult);
      setAllMessages((currentMessages) => [...currentMessages, videoMessageResult.data.createVideoMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendContent = async ( uniqueKey, title, description) => {
    try {
      const videoMessageResult = await client.mutate({
        mutation: gql(createVideoMessage),
        variables: {
          input: {
            id: uniqueKey,
            senderID: currentUserId,
            receiverID: selectedFriend.id, 
            title, 
            description, 
            date: new Date().toISOString(),
          }
        },
      });
    
      console.log('Video message created:', videoMessageResult);
      setAllMessages((currentMessages) => [...currentMessages, videoMessageResult.data.createVideoMessage]);
      alert("Content sent!"); 
      
    } catch (error) {
      console.error('Error creating video message:', error);
    }
  
    handleCloseModal();
  };

  const handleShowModal = () => setShowModal(true); 
  const handleCloseModal = () => setShowModal(false); 

  if (!selectedFriend) {
    return (
      <div className="col-9 col-auto">
        <h1 className="display-6">&emsp;Please select a friend to start chatting</h1>
      </div>
    );
  }

  return (
    <div className="col-9 col-auto d-flex flex-column">
      <div className="overflow-auto px-2 py-1 flex-grow-1">
        <div>
          <FilterMessages selectedFriend={selectedFriend} onFilterChange={handleFilterChange} />
        </div>
        <VideoMessagesList key={selectedFriend.id} selectedFriend={selectedFriend} messages={messages} loading={loading} error={error} />
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
        <PictureUploadForm handleSendContent={handleSendContent} />
      </Modal>
    </div>
  );
};

export default ChatView;
