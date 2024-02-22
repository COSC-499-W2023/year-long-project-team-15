import { useState, useEffect, useCallback } from 'react';
import client from '../apolloClient';
import { gql } from '@apollo/client';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { videoMessagesBySenderID, videoMessagesByReceiverID } from '../graphql/queries';
import { onCreateVideoMessage } from '../graphql/subscriptions';

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
        fetchPolicy: 'network-only'
      });

      const receivedMessagesResult = await client.query({
        query: gql(videoMessagesByReceiverID),
        variables: { receiverID: currentUserId, filter: { senderID: { eq: selectedFriend.id } } },
        fetchPolicy: 'network-only'
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

    const unsubscribe = client.subscribe({
        query: gql(onCreateVideoMessage),
  
      }).subscribe({
        next(response) {
          const newMessage = response.data.onCreateVideoMessage;
          console.log("New message: ", newMessage);
          if ((newMessage.sender.id === currentUserId && newMessage.receiver.id === selectedFriend.id) || 
              (newMessage.sender.id === selectedFriend.id && newMessage.receiver.id === currentUserId)) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        },
        error(err) { console.error('Subscription error:', err); },
      });
    

    return () => {
      setMessages([]);
      setLoading(false);
      setError(null);
      unsubscribe.unsubscribe();
    };
  }, [selectedFriend, currentUserId, fetchMessages]);


  return { messages, loading, error, fetchMessages };
};
