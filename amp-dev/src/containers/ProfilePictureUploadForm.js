import React, { useState } from 'react';
import Button from '../components/Button';
import { Storage, Auth } from 'aws-amplify';

const ProfilePictureUploadForm = ({ onClose }) => {
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

    try {
      // Get the current authenticated user
      const user = await Auth.currentAuthenticatedUser();

      // Upload the file to S3 with a key that includes the username
      const key = `profile-pictures/${user.username}/${selectedFile.name}`;
      const result = await Storage.put(key, selectedFile, {
        // options here
      });

      // Update user's profile picture URL in your backend (Cognito custom attribute)
      const profilePictureURL = result.key; // Using the S3 key as the URL 
      //Call your backend API 

      console.log('Succeeded:', result);
    } catch (error) {
      console.log('Error:', error);
    }

    if (onClose) onClose(); // Close modal after submitting
  };

  return (
    <div>
      <form>
        <div className="mb-3">
          <label htmlFor="pictureUpload" className="form-label">Upload Profile Picture:</label>
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

export default ProfilePictureUploadForm;
