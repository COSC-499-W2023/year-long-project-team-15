import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries';
import { createFriendRequest } from '../graphql/mutations';

function AddFriend() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSearch = async () => {
        try {
            const filter = { email: { eq: email } };
            const userData = await API.graphql(graphqlOperation(listUsers, { filter }));
            if (userData.data.listUsers.items.length > 0) {
                setSearchedUser(userData.data.listUsers.items[0]);
                setMessage('User found!');
            } else {
                setMessage('No user found with this email.');
            }
        } catch (error) {
            console.error('Error searching user:', error);
            setMessage('Error in searching for user.');
        }
    };

    const handleSendFriendRequest = async () => {
        if (!searchedUser) return;

        try {
            const input = {
                senderID: /* Your current user's ID */,
                receiverID: searchedUser.id,
                status: 'PENDING', // or any default status you use in your app
                // Add any other fields required by your schema
            };
            await API.graphql(graphqlOperation(createFriendRequest, { input }));
            setMessage('Friend request sent!');
        } catch (error) {
            console.error('Error sending friend request:', error);
            setMessage('Error in sending friend request.');
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter friend's email"
            />
            <button onClick={handleSearch}>Search</button>
            {searchedUser && (
                <button onClick={handleSendFriendRequest}>Send Friend Request</button>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddFriend;
