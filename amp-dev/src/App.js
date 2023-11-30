import { Amplify, Auth } from 'aws-amplify';
import awsExports from './aws-exports';
import { useState, useEffect } from 'react';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator, View, Text, Flex, signOut } from '@aws-amplify/ui-react';
import client from './apolloClient'; // Import Apollo Client
import { gql } from '@apollo/client';
import * as queries from './graphql/queries';
import Sidebar from './containers/Sidebar';
import ChatView from './containers/chatView';
import FriendContext from './context/FriendContext';
import Header from './containers/Header';
Amplify.configure(awsExports);

function App({ user, signOut }) {
const [selectedFriend, setSelectedFriend] = useState(null);
  return (
    <FriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
      <Header/>
      <div className="container-fluid">
        <div className="row vh-100">
          <Sidebar />
          <ChatView />
        </div>
    </div>
    </FriendContext.Provider>
  );
};

export default withAuthenticator(App);
