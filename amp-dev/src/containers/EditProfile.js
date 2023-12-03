import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';

function EditProfileForm({ userId }) {
    console.log("Received userId:", userId);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Added loading state
    const [showVerifyEmailPopup, setShowVerifyEmailPopup] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        console.log("useEffect triggered");
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data...");
                const authenticatedUser = await Auth.currentAuthenticatedUser();
                console.log("User data fetched:", authenticatedUser);
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
    
    

    const styles = {
        container: {
          padding: '20px',
          margin: '20px',
          backgroundColor: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
        },
        label: {
          display: 'block',
          marginBottom: '5px',
          marginTop: '10px',
          fontWeight: 'bold',
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
      };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    return newErrors;
  };

  /*
  const updateCognitoUser = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(cognitoUser, {
        'name': name,
        'email': email,
      });
      console.log('User attributes updated in Cognito User Pool');
    } catch (error) {
      console.error('Error updating user attributes in Cognito User Pool:', error);
    }
  };
*/
  const handleUpdateProfile = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
    }

    try {
        // Update user attributes in Cognito User Pool
        const cognitoUser = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(cognitoUser, {
            'name': name,
            'email': email,
        });
        console.log('User attributes updated in Cognito User Pool');
        setShowVerifyEmailPopup(true);
        
        // Prepare the input for the updateUser mutation
        const input = {
            id, // Assuming 'id' is the unique identifier for the user
            name, // New name from the form input
            email, // New email from the form input
        };

        // Call the updateUser mutation
        const response = await API.graphql(graphqlOperation(updateUser, { input }));
        console.log('User profile updated in DynamoDB:', response);

        // Optional: Callback to parent component to reflect changes
        //onUpdate();

    } catch (error) {
        console.error('Error updating user profile:', error);
        // Set error states here to display in the UI
    }
};

const handleVerifyEmail = async () => {
    try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        await Auth.verifyCurrentUserAttributeSubmit('email', verificationCode);
        console.log('Email verified successfully');
        setShowVerifyEmailPopup(false);
    } catch (error) {
        console.error('Error verifying email:', error);
        // Handle error (e.g., show error message)
    }
};

  if (isLoading) {
    return <div>Loading user data...</div>; // Loading state UI
}

return (
  <div style={styles.container}>
    {console.log("Rendering with state:", { id, name, email })}
    <label style={styles.label}>
      ID:
      <input
        style={styles.input}
        type="text"
        value={id}
        readOnly // ID field is read-only
      />
    </label>
    
    <label style={styles.label}>
      Name:
      <input
        style={styles.input}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
    
    <button style={styles.button} onClick={handleUpdateProfile}>Update Profile</button>

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
                </div>
            )}
  </div>
);
}

export default EditProfileForm;

