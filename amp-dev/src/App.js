import React from 'react';
import { Amplify } from 'aws-amplify';
import { Routes, Route } from 'react-router-dom';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import Main from './pages/Main';
import Account from './pages/Account';
import CustomLogin from './pages/LoginPage';
import CustomSignUp from './pages/SignUpPage';
import './App.css';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './services/ProtectedRoute';
import { FriendProvider } from './context/FriendContext';

Amplify.configure(awsExports);

const App = () => {
  return (
    <FriendProvider> 
      <AuthProvider>
        <Routes>
          <Route path="/landing" element={ <LandingPage/>}/>
          <Route path="/login" element={ <CustomLogin />}/>
          <Route path="/signup" element={<CustomSignUp />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } />
          <Route path="/accountpage" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider> 
    </FriendProvider>
  )
};

export default App;






