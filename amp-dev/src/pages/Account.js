import React from 'react';
import Header from "../containers/Header";
import AccountPageSidebar from "../containers/AccountPageSideBar";
import EditProfileForm from '../containers/EditProfile';

function Account() {
    return(
        <>
            <Header />
            <div style={{ display: 'flex' , flex: 1 }}>
                <AccountPageSidebar />
                <h1>Edit Profile</h1>
                <div style={{ display: 'flex',}}>
                    <EditProfileForm />
                </div>
            </div>
        </>
    );
};

export default Account;
