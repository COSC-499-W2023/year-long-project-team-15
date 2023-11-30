import Sidebar from '../containers/Sidebar';
import ChatView from '../containers/chatView';
import FriendContext from '../context/FriendContext';
import Header from '../containers/Header';
import { useState } from 'react';

function Main() {
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

export default Main;