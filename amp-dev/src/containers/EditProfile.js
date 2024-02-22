import React, { useState, useEffect } from 'react';
import { API, Auth, Storage, graphqlOperation } from 'aws-amplify';
import { updateUser } from '../graphql/mutations';
import AcceptButton from '../components/AcceptButton';
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        setId(authenticatedUser.username);
        setName(authenticatedUser.attributes.name);
        setEmail(authenticatedUser.attributes.email);
        setDateJoined(authenticatedUser.attributes.dateJoined);
        setSentFriendRequests(authenticatedUser.attributes.sentFriendRequests || []);

        // Retrieve the user's profile picture URL from Cognito custom attribute or any other source
        const userAttributes = await Auth.userAttributes(authenticatedUser);
        const profilePictureAttribute = userAttributes.find(attr => attr.Name === 'custom:ProfilePictureURL');
        if (profilePictureAttribute) {
          setProfilePictureURL(constructedS3URL);

        }

        // Dynamically set the S3 URL based on the authenticated user's username and a dynamic image filename
        // s3://blurvid-profile-pics/public/profilepic.png
        const s3Region = 'ca-central-1'; 
        const s3BucketName = 'blurvid-profile-pics'; 
        //const dynamicImageFilename = generateDynamicImageFilename();
        const s3Key = `public/profilepic.png`;
        const constructedS3URL = `https://s3-${s3Region}.amazonaws.com/${s3BucketName}/${s3Key}`;
        console.log('Constructed S3 URL:', constructedS3URL);
        setDynamicS3URL(constructedS3URL);
      } catch (error) {
        console.error('Error constructing S3 URL:', error);
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
      await API.graphql(graphqlOperation(updateUser, { input: { id, email, name, dateJoined} }));

      // Update email in Cognito
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentEmail = cognitoUser.attributes.email;

      // Send email verification code for any update (both name and email)
      await Auth.verifyCurrentUserAttribute('email');
      setShowVerifyEmailPopup(true); // Show verification code input

      if (email !== currentEmail) {
        await Auth.updateUserAttributes(cognitoUser, { email });
      }
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

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  const styles = {
    container: {
      padding: '20px',
      margin: '20px',
      backgroundColor: '#87CEEB',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      marginTop: '10px',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    },
    errorMessage: {
      color: 'red',
      fontSize: '0.9em',
      marginTop: '5px',
    },
    profilePicture: {
      maxWidth: '100%',
      maxHeight: '150px',
      marginBottom: '10px',
    },
    imageHolder: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    defaultImage: {
      width: '150px',
      height: '150px',
      border: '1px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    console.log('Profile Picture URL:', dynamicS3URL),
    <div style={styles.container}>
      <div style={styles.imageHolder}>
        {dynamicS3URL ? (
          <img src={dynamicS3URL} alt="Profile" style={styles.profilePicture} />
        ) : (
          <div style={styles.defaultImage}>
            No Profile Picture
          </div>
        )}
      </div>
  
      <div>
        <ProfilePictureUploadForm userId={id} />
      </div>
  
      <label style={styles.label}>
        Name:
        <input
          style={styles.input}
          type="text"
          value={name}
          readOnly // ID field is read-only
        />
        {errors.name && <p style={styles.errorMessage}>{errors.name}</p>}
      </label>
  
      <label style={styles.label}>
        Email:
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={styles.errorMessage}>{errors.email}</p>}
      </label>
  
      <AcceptButton label="Update Profile" onClick={handleUpdateProfile} />
  
      {showVerifyEmailPopup && (
        <div>
          <h4>Verify Email</h4>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={handleVerifyEmail}>
            Verify
          </button>
          {verificationError && (
            <p>{verificationError}</p>
          )}
        </div>
      )}
    </div>
  );
  
}

export default EditProfileForm;
