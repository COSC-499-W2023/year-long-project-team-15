import React, { useContext, useState } from 'react';
import { TextField, IconButton, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FriendContext from '../context/FriendContext';
import Modal from '../components/Modal';
import PictureUploadForm from './PictureUploadForm';
//import VideoPreviewModal from '../components/VideoPreviewModal'; // Assume this is your video modal component

const ChatView = () => {
  const { selectedFriend } = useContext(FriendContext);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [videoPreviewModalOpen, setVideoPreviewModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Mock video messages data
  const videoMessages = [
    { id: 1, sender: 'me', url: 'video-url-1.mp4' },
    { id: 2, sender: 'friend', url: 'video-url-2.mp4' },
    // Add more video messages here
  ];

  const openVideoPreview = (videoUrl) => {
    //setSelectedVideo(videoUrl);
   //setVideoPreviewModalOpen(true);
  };

  if (!selectedFriend) {
    return (
      <div className="col-9 col-auto">
        <h1 className="display-6">&emsp;Please select a friend to start chatting</h1>
      </div>
    );
  }

  const handleSendMessage = () => {
    // logic to send a message here
    console.log('Message to send:', message);
    setMessage('');
  };

  return (
    <div className="col-9 col-auto d-flex flex-column">
      <div className="overflow-auto px-2 py-1 flex-grow-1">
        <div>
          <p>&emsp;Chatting with: {selectedFriend.name}</p>
        </div>
        {/* Video messages display */}
        <Grid container spacing={2}>
          {videoMessages.map((video) => (
            <Grid item xs={4} key={video.id} className={video.sender === 'me' ? 'align-self-end' : ''}>
              <div onClick={() => openVideoPreview(video.url)} style={{ cursor: 'pointer', background: '#eee', padding: '10px' }}>
                {/* Placeholder for video thumbnail */}
                <img src="path/to/thumbnail.jpg" alt="Video Thumbnail" style={{ width: '100%', height: 'auto' }} />
              </div>
            </Grid>
          ))}
        </Grid>
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
        <div style={{ transform: 5 }}>
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon style={{ fontSize: 40 }} />
          </IconButton>
          <IconButton color="secondary" onClick={() => setShowModal(true)}>
            <PhotoCameraIcon style={{ fontSize: 40 }} />
          </IconButton>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} modalName="Upload Picture">
        <PictureUploadForm />
      </Modal>
      {/* Video Preview Modal */}
      {/* <VideoPreviewModal open={videoPreviewModalOpen} onClose={() => setVideoPreviewModalOpen(false)} videoUrl={selectedVideo} /> */}
    </div>
  );
};

export default ChatView;
