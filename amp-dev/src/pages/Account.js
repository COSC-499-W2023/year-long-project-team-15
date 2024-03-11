// Account.js

import React, { useState, useEffect } from 'react';
import Header from "../containers/Header";
import AccountPageSidebar from "../containers/AccountPageSideBar";
import EditProfileForm from '../containers/EditProfile';
import { Auth } from 'aws-amplify';

export function Account() {
    const [name, setName] = useState('');
  
    useEffect(() => {
      const fetchUserName = async () => {
        try {
          const authenticatedUser = await Auth.currentAuthenticatedUser();
          setName(authenticatedUser.attributes.name);
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };
  
      fetchUserName();
    }, []);
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'white' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1 }}>
          <AccountPageSidebar />
          <div style={{ display: 'flex', flexDirection: 'column', paddingRight: 10, alignItems: 'center', flex: 3 }}>
            <h1 style={{ fontStyle: 'italic', color: '#282c34' }}>Hello, {name}</h1>
            <EditProfileForm name={name} />
          </div>
        </div>
      </div>
    );
  }
export default Account;
