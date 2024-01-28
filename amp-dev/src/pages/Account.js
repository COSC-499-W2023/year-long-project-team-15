import React from 'react';
import Header from "../containers/Header";

import FriendContext from '../context/FriendContext';
import { useState } from 'react';

import AccountPageSidebar from "../containers/AccountPageSideBar";
import EditProfileForm from '../containers/EditProfile';

function Account() {
    const [selectedFriend, setSelectedFriend] = useState(null);
    return(
      
        <FriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Header />
        

        
        <div style={{ display: 'flex' , flex: 1 }}>
            <AccountPageSidebar />
            <div style={{ display: 'flex', flexDirection: 'column',paddingRight: 200, alignItems: 'center', flex: 3 }}>
            <h1>Edit Profile</h1>
            <EditProfileForm />
            </div>
        </div>
        </div>
         </FriendContext.Provider>
        );

    }
    


export default Account;
