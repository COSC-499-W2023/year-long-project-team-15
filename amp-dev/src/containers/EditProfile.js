import React, { useState, useEffect } from 'react';
// import { API, graphqlOperation, Auth } from 'aws-amplify';
// import { updateUser } from './graphql/mutations';

function EditProfileForm({ user /*, onUpdate */ }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  /*
  useEffect(() => {
    setId(user.attributes.sub || '');
    setName(user.attributes.name || '');
    setEmail(user.attributes.email || '');
  }, [user]);
  /*

  /* 
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

  const handleUpdateProfile = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      // Prepare the input for the updateUser mutation
      const input = {
        id, // Assuming 'id' is the unique identifier for the user
        name, // New name from the form input
        email, // New email from the form input
      };

      // Call the updateUser mutation
      const response = await API.graphql(graphqlOperation(updateUser, { input }));
      console.log('User profile updated in DynamoDB:', response);

      // Update user attributes in Cognito User Pool
      await updateCognitoUser();

      // Callback to parent component to reflect changes
      onUpdate();
    } catch (error) {
      console.error('Error updating user profile:', error);
      // sets error states here to display in the UI
    }
  };
  */
  const styles = {
    container: {
      padding: '20px',
      margin: '20px',
      backgroundColor: '#fff', // Replace with your actual background color
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      marginTop: '10px',
      fontWeight: 'bold',
      color: '#333', // Replace with your actual label text color
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ccc', // Replace with your actual border color
      boxSizing: 'border-box',
    },
    errorMessage: {
      color: 'red', // Replace with your actual error message color
      fontSize: '0.9em',
      marginTop: '5px',
    },
    // Add more styles as needed
  };

  return (
    <div style={styles.container}>
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
      
      {<button style={styles.button}>Update Profile</button>}
    </div>
  );
}

export default EditProfileForm;

