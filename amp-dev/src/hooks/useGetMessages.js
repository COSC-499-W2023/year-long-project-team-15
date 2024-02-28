import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
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
    console.log("fetchng messages");
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
    if(selectedFriend){
        const subscription = API.graphql({
            query: onCreateVideoMessage,
            variables: {
              filter: {
                senderID: { eq: selectedFriend.id },
                receiverID: { eq: currentUserId },
                //senderID: { eq: currentUserId },
                //receiverID: { eq: selectedFriend.id },
              },
            },
          }).subscribe({
            next: ({ value }) => {
              const newMessage = value.data.onCreateVideoMessage;
              console.log("new message recieved: ", newMessage);
              if (newMessage) {
                console.log("new message recieved: ", newMessage);
                setMessages(currentMessages => [...currentMessages, newMessage]);
            }
            },
            error: (error) => console.warn(error),
          });
      
          // Clean up the subscription on component unmount
          return () => {
            subscription.unsubscribe();
          };
    }
}, [selectedFriend, currentUserId, fetchMessages]);

  return { messages, setMessages, loading, error, fetchMessages };
};
