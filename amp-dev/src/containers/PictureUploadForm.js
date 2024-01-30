import React, { useState } from 'react';
import Button from '../components/Button';
import { Storage } from 'aws-amplify';

const PictureUploadForm = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setProcessedImageUrl(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    // logic to handle the file upload

    console.log('Uploading file:', selectedFile.name);
    setIsLoading(true); // Start loading

    try {
      const result = await Storage.put(selectedFile.name, selectedFile, {
        // options here
      });
      console.log('Succeeded:', result);
      startPollingForProcessedImage(selectedFile.name);
    } catch (error) {
      console.log('Error:', error);
    }
    if (onClose) onClose(); // Close modal after submitting
  };

  const checkImageStatus = async (fileName) => {
    try {
      // Example: Checking the image directly from S3
      // This could be replaced with an API call
      const url = await Storage.get(`public/${fileName}`, {
        bucket: 'blurvid-photos',
        region: 'ca-central-1',
      });
      setProcessedImageUrl(url);
      setIsLoading(false);
      clearInterval(pollingInterval);
      console.log(processedImageUrl);
    } catch (error) {
      console.log('Image not ready yet:', error.message);
      // Optionally implement a retry limit or error handling logic
    }
  };

  let pollingInterval = null;

  const startPollingForProcessedImage = (fileName) => {
    const pollingFrequency = 5000; // Poll every 5 seconds
    pollingInterval = setInterval(() => checkImageStatus(fileName), pollingFrequency);
  };

  return (
    <div >
        {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : processedImageUrl ? (
        <div className="image-container">
            <img src={processedImageUrl} alt="Processed" />
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
      </div>          <Button
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
