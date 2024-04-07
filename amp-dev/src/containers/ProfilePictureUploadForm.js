import React, { useState } from 'react';
import Button from '../components/Button';
import { Storage, Auth } from 'aws-amplify';

const isImage = (file) => {
  const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more if needed
  return file && acceptedImageTypes.includes(file.type);
};

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

    if (!isImage(selectedFile)) {
      alert('Please select a valid image file (JPEG, PNG, GIF).');
      return;
    }

    try {
      // Get the current authenticated user
      const user = await Auth.currentAuthenticatedUser();

      // Delete the existing profile picture if it exists
      const existingKey = `public/${user.username}/profilepic`;
      await Storage.remove(existingKey);

      // Upload the new file to S3 with the same key ("profilepic")
      const newKey = existingKey;
      const result = await Storage.put(newKey, selectedFile, {
        bucket: 'blurvid-profile-pics',
        region: 'ca-central-1',
      });

      // Update user's profile picture URL in your backend (Cognito custom attribute)
      const profilePictureURL = result.key; // Using the S3 key as the URL

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
          <label htmlFor="pictureUpload" className="form-label"></label>
          <input
            type="file"
            className="form-control"
            id="pictureUpload"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <Button
          label="Upload Profile Picture"
          onClick={handleSubmit}
          className="btn btn-secondary custom-button"
          style={{ border: '1px solid white' }}
        />
      </form>
    </div>
  );
};

export default ProfilePictureUploadForm;
