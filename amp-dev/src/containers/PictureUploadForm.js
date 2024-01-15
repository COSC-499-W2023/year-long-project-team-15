import React, { useState } from 'react';
import Button from '../components/Button';

const PictureUploadForm = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    // logic to handle the file upload
    console.log('Uploading file:', selectedFile.name);
    // After upload logic
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
