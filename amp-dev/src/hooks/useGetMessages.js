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
  const [allMessages, setAllMessages] = useState([]); 
  const [filterCriteria, setFilterCriteria] = useState({ date: '', includeContentMessagesOnly: false });

  const applyFilters = useCallback(() => {
    console.log("appling filter", filterCriteria);
   
    const filtered = allMessages.filter(message => {
      if (filterCriteria.includeContentMessagesOnly && message.message) {
        return false;
      }
      if (filterCriteria.date) {
        const messageDate = new Date(message.date).toDateString();
        const filterDate = new Date(filterCriteria.date).toDateString();
        return messageDate === filterDate;
      }
      return true;
    });
    setMessages(filtered);
  }, [allMessages, filterCriteria]);
  
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

      setAllMessages(combinedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, selectedFriend?.id]);

  useEffect(() => {
    fetchMessages();

    let subscription;

    if(selectedFriend){
        subscription = API.graphql({
            query: onCreateVideoMessage,
            variables: {
              filter: {
                senderID: { eq: selectedFriend.id },
                receiverID: { eq: currentUserId },
              },
            },
          }).subscribe({
            next: ({ value }) => {
              const newMessage = value.data.onCreateVideoMessage;
              if (newMessage) {
                console.log("new message recieved: ", newMessage);
                setAllMessages(currentMessages => [...currentMessages, newMessage]);
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

useEffect(() => {
  applyFilters();
}, [allMessages, filterCriteria, applyFilters]);

const updateFilterCriteria = useCallback((newCriteria) => {
  setFilterCriteria(newCriteria);
}, []);

  return { messages, setAllMessages, loading, error, fetchMessages, updateFilterCriteria };
};
