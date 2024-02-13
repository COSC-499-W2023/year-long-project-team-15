import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      checkAuthState();
    }, []);
  
    const checkAuthState = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
  
    const signIn = async (email, password) => {
      await Auth.signIn(email, password);
      setIsAuthenticated(true);
    };
  
    const signOut = async () => {
      await Auth.signOut();
      setIsAuthenticated(false);
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, checkAuthState, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);