import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';

function EditProfileForm({ userId }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showVerifyEmailPopup, setShowVerifyEmailPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        setId(authenticatedUser.username);
        setName(authenticatedUser.attributes.name);
        setEmail(authenticatedUser.attributes.email);
      } catch (error) {
        console.error('Error fetching authenticated user data:', error);
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
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    popupContainer: {
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>

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

      <button style={styles.button} onClick={handleUpdateProfile}>
        Update Profile
      </button>

      {showVerifyEmailPopup && (
        <div style={styles.popupContainer}>
          <h4>Verify Email</h4>
          <input
            style={styles.input}
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button style={styles.button} onClick={handleVerifyEmail}>
            Verify
          </button>
          {verificationError && (
            <p style={styles.errorMessage}>{verificationError}</p>
          )}
        </div>
      )}
    </div>
  );
}


export default EditProfileForm;
