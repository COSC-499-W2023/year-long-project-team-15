import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import * as queries from './graphql/mutations';

function EditProfileForm({ user, onUpdate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setName(user.attributes.name || ''); // Populate with user's name
    setEmail(user.attributes.email || ''); // Populate with user's email
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      // Call GraphQL mutation to update user profile in DynamoDB
      const response = await API.graphql({
        query: queries.updateUser,
        variables: {
          input: {
            id: user.attributes.sub,
            name,
            email,
          },
        },
      });

      // Handle the response as needed
      console.log('User profile updated:', response);

      // Update local state or trigger a callback to refresh user data
      onUpdate();
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Handle error, show a message to the user, etc.
    }
  };

  return (
    <div>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
}

export default EditProfileForm;

