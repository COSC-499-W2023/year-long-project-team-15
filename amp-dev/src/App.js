import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { useState } from 'react';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from '@aws-amplify/ui-react';
import Sidebar from './containers/Sidebar';
import ChatView from './containers/chatView';
import FriendContext from './context/FriendContext';
import Header from './containers/Header';
Amplify.configure(awsExports);

function App() {
const [selectedFriend, setSelectedFriend] = useState(null);
  return (
    <FriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar />
                <ChatView />
            </div>
        </div>  
    </FriendContext.Provider>
  );
};

export default withAuthenticator(App);
