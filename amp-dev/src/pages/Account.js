import React from 'react';
import Header from "../containers/Header";
import AccountSidebar from '../containers/AccountSidebar';
import FriendContext from '../context/FriendContext';
import { useState } from 'react';

import AccountPageSidebar from "../containers/AccountPageSideBar";
import EditProfileForm from '../containers/EditProfile';

function Account() {
    const [selectedFriend, setSelectedFriend] = useState(null);
    return(
      
        <FriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
        <div style={{ display: 'flex' , flex: 1 }}>
            <AccountPageSidebar />
            
            <h1>Edit Profile</h1>
            <div style={{ display: 'flex',}}>
                    <EditProfileForm />
                </div>
        </div>
         </FriendContext.Provider>
        );

    }
    


export default Account;
