// ChatView.js
import React, { useContext, useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import FriendContext from '../context/FriendContext';

const ChatView = () => {
  const { selectedFriend } = useContext(FriendContext);
  const [message, setMessage] = useState('');

  if (!selectedFriend) {
    return (
        <div className="col-9 col-auto">
        <div>Please select a friend to start chatting.</div>
        </div>
    );
  }

  const handleSendMessage = () => {
    // logic to send a message here
    console.log('Message to send:', message);
    setMessage('');
  };

  const handleUploadVideo = () => {
    // logic to upload a video here
    console.log('Uploading video...');
  };

  return (
    <div className="col-9 col-auto d-flex flex-column">
    <div className="overflow-auto px-2 py-1 flex-grow-1">
        <div>
            <p>Chatting with: {selectedFriend.name}</p>
        </div>
        {/* Messages will be displayed here. Consider using a map function to render individual messages */}
      </div>
      <div className="d-flex align-items-center p-2 mt-auto">
        <TextField
          label="Type a message..."
          variant="outlined"
          className="flex-grow-1 me-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleUploadVideo}>
          <VideoCallIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatView;
