import React from 'react';
import Header from "../containers/Header";
import AccountPageSidebar from "../containers/AccountPageSideBar";
import EditProfileForm from '../containers/EditProfile';

function Account() {
    return(
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
        
        );

    }
    


export default Account;
