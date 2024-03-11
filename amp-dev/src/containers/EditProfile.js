import React, { useState, useEffect } from 'react';
import { API, Auth, Storage, graphqlOperation } from 'aws-amplify';
import { updateUser } from '../graphql/mutations';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Typography, } from '@mui/material';
import ProfilePictureUploadForm from './ProfilePictureUploadForm';

function EditProfileForm({ userId }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showVerifyEmailPopup, setShowVerifyEmailPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [dynamicS3URL, setDynamicS3URL] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        setId(authenticatedUser.username);
        setName(authenticatedUser.attributes.name);
        setEmail(authenticatedUser.attributes.email);
        setDateJoined(authenticatedUser.attributes.dateJoined);
        setSentFriendRequests(authenticatedUser.attributes.sentFriendRequests || []);

        const userAttributes = await Auth.userAttributes(authenticatedUser);
        const profilePictureAttribute = userAttributes.find(attr => attr.Name === 'custom:ProfilePictureURL');
        if (profilePictureAttribute) {
          setProfilePictureURL(profilePictureAttribute.Value);
        }

        const s3BucketName = 'blurvid-profile-pics';
        const s3Key = `public/${authenticatedUser.username}/profilepic.png`;
        const constructedS3URL = `https://${s3BucketName}.s3.amazonaws.com/${s3Key}`;
        setDynamicS3URL(constructedS3URL);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    const formErrors = {};
    if (!email.trim()) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Email address is invalid';
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    try {
      // Update user in DynamoDB
      await API.graphql(graphqlOperation(updateUser, { input: { id, email, name, dateJoined } }));
  
      // Update email in Cognito
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentEmail = cognitoUser.attributes.email;
  
      // Send email verification code for any update (both name and email)
      await Auth.verifyCurrentUserAttribute('email');
      setShowVerifyEmailPopup(true);
  
      if (email !== currentEmail) {
        await Auth.updateUserAttributes(cognitoUser, { email });
      }
  
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      setVerificationError('Verification code is required');
      return;
    }

    try {
      await Auth.verifyCurrentUserAttributeSubmit('email', verificationCode);
      setShowVerifyEmailPopup(false);
      setVerificationCode('');
      setVerificationError('');
      console.log('Email verified successfully');
    } catch (error) {
      setVerificationError('Error verifying email: ' + error.message);
      console.error('Error verifying email:', error);
    }
  };

  const handleCloseVerifyEmailPopup = () => {
    setShowVerifyEmailPopup(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setEmail('');
    setName('');
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
    greeting: {
      textAlign: 'center',
      marginBottom: '20px',
      fontFamily: 'cursive',  
      fontSize: '1.5em',  
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
    },
    button: {
      color: 'white',
      borderColor: 'white',
      marginBottom: '10px',
      fontSize: '0.5em', 
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      boxSizing: 'border-box',
      color: 'white',
    },
    errorMessage: {
      color: 'red',
      fontSize: '0.9em',
      marginTop: '5px',
    },
    profilePicture: {
      width: '150px',
      height: '150px',
    },
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.greeting}>
      </div>
      <div style={styles.avatarContainer}>
        <Avatar alt="Profile" src={dynamicS3URL} style={styles.avatar} />
        {isEditing && (
          <ProfilePictureUploadForm userId={id} />
        )}
      </div>

      {!isEditing && (
        <div style={styles.button}>
        <Button
          variant="outlined"
          onClick={handleEdit}
          style={{ color: 'white', borderColor: 'white', fontSize: '1.5em', 
          '&:hover': {
            backgroundColor: '#063e93',
            borderColor: '#063e93',
          },}}
        >
          Edit Profile
        </Button>
      </div>
      )}

      {isEditing && (
        <div>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          {errors.name && <p style={styles.errorMessage}>{errors.name}</p>}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          {errors.email && <p style={styles.errorMessage}>{errors.email}</p>}

          <Dialog open={showVerifyEmailPopup} onClose={handleCloseVerifyEmailPopup}>
            <DialogTitle>Verify Email</DialogTitle>
            <DialogContent>
              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={styles.input}
              />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseVerifyEmailPopup} style={{ color: 'white', borderColor: 'white', fontSize: '0.8em' }}>
              Cancel
            </Button>
            <Button onClick={handleVerifyEmail} style={{ color: 'white', borderColor: 'white', fontSize: '0.8em' }}>
              Verify
            </Button>
            </DialogActions>
          </Dialog>

          <div>
          <Button variant="outlined" onClick={handleCancelEdit} style={{ color: 'white', borderColor: 'white', fontSize: '0.8em' }}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleUpdateProfile} style={{ color: 'white', borderColor: 'white', fontSize: '0.8em', marginLeft: '10px' }}>
            Save
          </Button>
          </div>
        </div>
      )}

      {showVerifyEmailPopup && (
        <div>
          <h4>Verify Email</h4>
          <TextField
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={styles.input}
          />
          <Button onClick={handleVerifyEmail} style={{ marginTop: '10px' }}>
            Verify
          </Button>
          {verificationError && (
            <p style={styles.errorMessage}>{verificationError}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default EditProfileForm;
