import React, { useState } from 'react';
import Button from '../components/Button';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

const PictureUploadForm = ({ handleSendContent}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uniqueKey, setUniqueKey] = useState(null);
  const [bucketConfig, setBucketConfig] = useState({ name: '', region: ''});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProcessedUrl(null);
      determineBucket(file); 
    }
  };

  const determineBucket = (file) => {
    console.log('file', file);
    console.log(file.type);
    if (file.type.startsWith("image/") && !file.type.startsWith("image/gif")) {
      setBucketConfig({ name: 'blurvid-photos', region: 'ca-central-1'});
      setFileType('image');
    } else if (file.type.startsWith("video/") || file.type.startsWith("image/gif")) {
      setBucketConfig({ name: 'rekognitionvideofaceblurr-inputimagebucket20b2ba6b-kfbjqw5ifll4', region: 'us-west-2'});
      setFileType('video');
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();

    handleSendContent(uniqueKey, title, description, fileType);

    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setIsLoading(false);
  };
    
  const clearFile = async (event) => {
    event.preventDefault();
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setProcessedUrl(null);
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

      if (!bucketConfig) {
        alert('Unsupported file type');
        return;
      }
    
      console.log('Uploading file with unique key:', uniqueKey);
      setIsLoading(true); // Start loading
    
      try {
        const result = await Storage.put(uniqueKey, selectedFile, {
          bucket: bucketConfig.name,
          region: bucketConfig.region,
        });
        
        console.log('Succeeded:', result);
      
        startPollingForProcessedContent(uniqueKey);

      } catch (error) {
        console.log('Error :', error);
        setIsLoading(false);
      }
    };
  let pollingInterval = null;

  const startPollingForProcessedContent = (fileName) => {
    const pollingFrequency = 5000; // Poll every 5 seconds
    pollingInterval = setInterval(() => checkStatus(fileName), pollingFrequency);
  };

  const checkStatus = async (fileName) => {
    try {
     
      const url = await Storage.get((fileName), {
        bucket: bucketConfig.name,
        region: bucketConfig.region,
      });

      setProcessedUrl(url);
      if(processedUrl){
        console.log(processedUrl);
        setIsLoading(false);
        clearInterval(pollingInterval);
      }
      
    } catch (error) {
      console.log('content not ready yet:', error.message);
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
      ) : processedUrl ? (
        <div>
          <div className="image-container">
          {fileType === 'video' ? (
              <video controls src={processedUrl} style={{ maxWidth: '100%' }} />
            ) : (
              <img src={processedUrl} alt="Processed" />
            )}
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
              id="ContentUpload"
              accept="image/*,video/*"
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
