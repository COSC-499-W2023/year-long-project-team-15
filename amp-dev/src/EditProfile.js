import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { updateUser } from './graphql/mutations'; // Import the updateUser mutation

function EditProfileForm({ user, onUpdate }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setId(user.attributes.sub || ''); // Populate with user's ID
    setName(user.attributes.name || ''); // Populate with user's name
    setEmail(user.attributes.email || ''); // Populate with user's email
  }, [user]);

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

      // Caling the updateUser mutation
      const response = await API.graphql(graphqlOperation(updateUser, { input }));
      console.log('User profile updated:', response);
      onUpdate(); // Callback to parent component to reflect changes
    } catch (error) {
      console.error('Error updating user profile:', error);
      // sets error states here to display in the UI
    }
  };

  return (
    <div>
      <label>
        ID:
        <input
          type="text"
          value={id}
          readOnly // ID field is read-only
        />
      </label>
      <br />
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </label>
      <br />
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
}
export default EditProfileForm;



