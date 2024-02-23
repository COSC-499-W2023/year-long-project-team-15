import React, { useState } from 'react';
import Button from '../components/Button';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { createVideoMessage } from '../graphql/mutations';
import { gql } from '@apollo/client';
import client from '../apolloClient';
import { useFriend } from '../context/FriendContext';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetMessages } from '../hooks/useGetMessages';


const PictureUploadForm = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { selectedFriend } = useFriend();
  const { currentUserId } = useCurrentUser();
  const [uniqueKey, setUniqueKey] = useState(null);
  const { fetchMessages } = useGetMessages({ selectedFriend });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setProcessedImageUrl(null);
  };

  const handleSend = async (event) => {
    event.preventDefault();
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
      alert("Content sent!"); 

      fetchMessages();

      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating video message:', error);

    }
  
    if (onClose) onClose(); 
  };
    
  const clearFile = async (event) => {
    event.preventDefault();
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setProcessedImageUrl(null);
      setIsLoading(false);
      if (pollingInterval) clearInterval(pollingInterval);
      return;
    }
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!selectedFile) {
        alert('Please select a file to upload.');
        return;
      }
    
      // Generate a unique file key using UUID
      
      const uniqueKey = uuidv4();
      setUniqueKey(uniqueKey);
    
      console.log('Uploading file with unique key:', uniqueKey);
      setIsLoading(true); // Start loading
    
      try {
        const result = await Storage.put(uniqueKey, selectedFile, {
        });
        
        console.log('Succeeded:', result);
        // Use uniqueKey instead of selectedFile.name to start polling
        startPollingForProcessedImage(uniqueKey);

      } catch (error) {
        console.log('Error :', error);
        setIsLoading(false);
      }
    };
  let pollingInterval = null;

  const startPollingForProcessedImage = (fileName) => {
    const pollingFrequency = 5000; // Poll every 5 seconds
    pollingInterval = setInterval(() => checkImageStatus(fileName), pollingFrequency);
  };

  const checkImageStatus = async (fileName) => {
    try {
      // Example: Checking the image directly from S3
      // This could be replaced with an API call
      const url = await Storage.get((fileName), {
        bucket: 'blurvid-photos',
        region: 'ca-central-1',
      });
      const img = new Image();

      // Set up onload event
      img.onload = () => {
        // Image has loaded, update state
        setProcessedImageUrl(url);
        setIsLoading(false);
        clearInterval(pollingInterval);
      };
      img.src = url;

      // Set the source of the image
      console.log(processedImageUrl);
    } catch (error) {
      console.log('Image not ready yet:', error.message);
      // Optionally implement a retry limit or error handling logic
    }
  };

  return (
    <div >
        {isLoading ? (
        <div className="d-flex flex-column align-items-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden"></span>
        </div>
        <div>Blurring... This may take a while :/</div>
      </div>
      ) : processedImageUrl ? (
        <div>
          <div className="image-container">
              <img src={processedImageUrl} alt="Processed" />
          </div>
          <div className="d-flex justify-content-end">
            <Button
              label="Cancel"
              onClick={clearFile}
              className="btn btn-secondary custom-button-form"
            />
            <Button
              label="Send"
              onClick={handleSend}
              className="btn btn-secondary custom-button-form"
            />
          </div>
         </div>
    ) :(
        <form>
          <div className="mb-3">
            <label htmlFor="pictureUpload" className="form-label">Upload Picture</label>
            <input
              type="file"
              className="form-control"
              id="pictureUpload"
              accept="image/*"
              onChange={handleFileChange}
            />
            <input
              className="form-control"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>      
            <Button
                label="Submit"
                onClick={handleSubmit}
                className="btn btn-secondary custom-button"
              />
        </form>
      )}
    </div>
  );
};

export default PictureUploadForm;
