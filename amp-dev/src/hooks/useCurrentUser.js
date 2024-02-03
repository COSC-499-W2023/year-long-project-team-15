
import { useState, useEffect } from 'react';
import * as AuthService from '../services/AuthService';

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userId = await AuthService.getAuthenticatedUserId();
        setCurrentUserId(userId);
        const userName = await AuthService.getAuthenticatedUserName();
        setCurrentUserName(userName);
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUserId, currentUserName, isLoading };
};
