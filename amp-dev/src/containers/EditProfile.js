import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Avatar, Button, TextField } from '@mui/material';
import ProfilePictureUploadForm from './ProfilePictureUploadForm';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';

function EditProfileForm({ userId }) {
  const [dynamicS3URL, setDynamicS3URL] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const { data } = await API.graphql({
          query: getUser,
          variables: { id: authenticatedUser.username },
        });
        setUserDetails(data.getUser);
        setName(data.getUser.name || '');
        const s3BucketName = 'blurvid-profile-pics';
        const s3Key = `public/public/${authenticatedUser.username}/profilepic`;
        const constructedS3URL = `https://${s3BucketName}.s3.ca-central-1.amazonaws.com/${s3Key}`;
        console.log('Constructed S3 URL:', constructedS3URL);
        setDynamicS3URL(constructedS3URL);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = async () => {
    try {
      await Auth.updateUserAttributes(Auth.user, { name }); // Update name in AWS Cognito
      const updatedUserData = { id: userId, name };
      await API.graphql(graphqlOperation(updateUser, { input: updatedUserData })); // Update name in DynamoDB
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      margin: '20px',
      backgroundColor: '#282c34',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      color: 'white',
    },
    avatarContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    avatar: {
      width: '150px',
      height: '150px',
      cursor: 'pointer',
    },
    inputLabel: {
      color: 'white',
    },
    input: {
      width: '100%',
      padding: '5px',
      margin: '10px 0',
      borderRadius: '4px',
      boxSizing: 'border-box',
      color: 'white', 
    },
    button: {
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.avatarContainer}>
        <Avatar
          alt="Profile"
          src={dynamicS3URL}
          style={styles.avatar}
          onClick={handleEdit}
        />
        {isEditing && (
          <ProfilePictureUploadForm userId={userId} />
        )}
      </div>
      {isEditing && userDetails && (
        <div>
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            style={styles.input}
            InputLabelProps={{ style: styles.inputLabel }}
            InputProps={{ style: styles.input }}
          />
          <Button variant="contained" color="primary" style={styles.button} onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
      {!isEditing && userDetails && (
        <div>
          <TextField
            label="Name"
            value={userDetails.name || ''}
            InputProps={{ readOnly: true, style: styles.input }}
            InputLabelProps={{ style: styles.inputLabel }}
          />
          <TextField
            label="Email"
            value={userDetails.email || ''}
            InputProps={{ readOnly: true, style: styles.input }}
            InputLabelProps={{ style: styles.inputLabel }}
          />
        </div>
      )}
      {!isEditing && userDetails && (
        <Button variant="contained" color="primary" style={styles.button} onClick={handleEdit}>
          Edit Profile
        </Button>
      )}
    </div>
  );
}

export default EditProfileForm;
