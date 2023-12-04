import Header from "../containers/Header";
import AccountSidebar from '../containers/AccountSidebar';
import FriendContext from '../context/FriendContext';
import { useState } from 'react';


function Account() {
    const [selectedFriend, setSelectedFriend] = useState(null);
    return(
        
        <FriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Header />
                <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                    <div style={{ flex: 3 }}>
                        <AccountSidebar />
                    </div>
                    <div style={{ flex: 2, paddingRight: '500px' }}>
                        <h1>Account Page</h1> 
                    </div>
                </div>
            </div>
        </FriendContext.Provider>         
    );
};

export default Account;