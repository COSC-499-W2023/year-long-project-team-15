import { useState, useEffect, useCallback } from 'react';
import client from '../apolloClient';
import { gql } from '@apollo/client';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { videoMessagesBySenderID, videoMessagesByReceiverID } from '../graphql/queries';

export const useGetMessages = ({ selectedFriend }) => {
  const { currentUserId } = useCurrentUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  


  const fetchMessages = useCallback(async () => {
    if (!currentUserId || !selectedFriend?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const sentMessagesResult = await client.query({
        query: gql(videoMessagesBySenderID),
        variables: { senderID: currentUserId, filter: { receiverID: { eq: selectedFriend.id } } },
        fetchPolicy: 'cache-first'
      });

      const receivedMessagesResult = await client.query({
        query: gql(videoMessagesByReceiverID),
        variables: { receiverID: currentUserId, filter: { senderID: { eq: selectedFriend.id } } },
        fetchPolicy: 'cache-first'
      });

      const combinedMessages = [
        ...sentMessagesResult.data.videoMessagesBySenderID.items,
        ...receivedMessagesResult.data.videoMessagesByReceiverID.items,
      ].sort((a, b) => new Date(a.date) - new Date(b.date));

      setMessages(combinedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, selectedFriend?.id]);

  useEffect(() => {
    fetchMessages();

    return () => {
      setMessages([]);
      setLoading(false);
      setError(null);
    };
  }, [fetchMessages]);


  return { messages, loading, error };
};
