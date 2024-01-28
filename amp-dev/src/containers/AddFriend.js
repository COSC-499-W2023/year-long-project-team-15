import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { listUsers } from '../graphql/queries';
import { createFriendRequest } from '../graphql/mutations';
import Button from '../components/Button'; 

const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log('Current User:', user);
        setCurrentUser(user);
        fetchUsers();
      })
      .catch(err => console.error('Error fetching current user:', err));
  }, []);

  const fetchUsers = async () => {
    try {
      const userData = await API.graphql(graphqlOperation(listUsers));
      setUsers(userData.data.listUsers.items);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!selectedUserId || !currentUser || !currentUser.attributes) {
      console.error('Invalid user or user attributes.');
      setMessage('Error in sending friend request. Invalid user or user attributes.');
      return;
    }
  
    try {
      const input = {
        senderID: currentUser.attributes.sub,
        receiverID: selectedUserId,
        status: 'Pending',
        date: new Date().toISOString(),
      };
  
      console.log('Sending friend request with input:', input);
  
      const result = await API.graphql(graphqlOperation(createFriendRequest, { input }));
  
      if (result.errors && result.errors.length > 0) {
        // Log GraphQL errors
        result.errors.forEach(error => {
          console.error('GraphQL error:', error.message);
        });
  
        setMessage('Error in sending friend request. Check console for details.');
      } else {
        // Check if the friend request was created successfully
        const friendRequest = result.data.createFriendRequest;
        if (friendRequest) {
          console.log('Friend request result:', friendRequest);
          setMessage('Friend request sent!');
        } else {
          console.error('Error creating friend request. Check console for details.');
          setMessage('Error in sending friend request. Check console for details.');
        }
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      setMessage(`Error in sending friend request: ${error.message}`);
    }
  };
  
  
  const styles = {
    SearchButton: {
      backgroundColor: '#55c2da',
      color: 'black',
      border: 'none',
      padding: '0.1px 0.1px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginLeft: '8px',
    },
    SendRequestButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '1px 1px',
        borderRadius: '3px',
        cursor: 'pointer',
        marginLeft: '8px',
        float: 'right'
      },
    ListContainer: {
      maxHeight: '300px', // Set a maximum height for the list container
      overflowY: 'auto',  // Make the container scrollable
    },
  };

  return (
    <div>
      <ul style={styles.ListContainer}>
      {users
        .filter(user => user.id !== currentUser.attributes.sub) // Exclude the current user
        .map(user => (
        <li key={user.id}>
        {user.name} ({user.email})
        <button
        style={styles.SearchButton}
        onClick={() => setSelectedUserId(user.id)}
        className="btn btn-secondary"
      >
        Add Contact
      </button>
    </li>
  ))}

      </ul>
      {selectedUserId && (
        <button
          style={styles.SendRequestButton}
          onClick={handleSendFriendRequest}
          className="btn btn-secondary"
        >
          Send Friend Request to {users.find(user => user.id === selectedUserId)?.name}
        </button>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddFriend;




