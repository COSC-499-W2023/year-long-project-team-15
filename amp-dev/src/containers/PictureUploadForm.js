import React, { useState } from 'react';
import Button from '../components/Button';
import { Storage } from 'aws-amplify';

const PictureUploadForm = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    // logic to handle the file upload

    console.log('Uploading file:', selectedFile.name);
    try {
      const result = await Storage.put(selectedFile.name, selectedFile, {
        // options here
      });
      console.log('Succeeded:', result);
    } catch (error) {
      console.log('Error:', error);
    }
    if (onClose) onClose(); // Close modal after submitting
  };

  return (
    <div >
    <form >
      <div className="mb-3">
        <label htmlFor="pictureUpload" className="form-label">Upload Picture</label>
        <input
          type="file"
          className="form-control"
          id="pictureUpload"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <Button
          label="Submit"
          onClick={handleSubmit}
          className="btn btn-secondary custom-button"
        />
    </form>
    </div>
  );
};

export default PictureUploadForm;
