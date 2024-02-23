import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { useFriend } from './FriendContext';

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const { clearFriendContext }  = useFriend();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuthState();
  }, []);

  const signIn = async (email, password) => {
    try {
      await Auth.signIn(email, password);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      clearFriendContext();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isAuthenticating) {
    return <div>Loading...</div>; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
