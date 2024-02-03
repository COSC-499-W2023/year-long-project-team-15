
import { useState, useCallback } from 'react';
import client from '../apolloClient';
import { gql } from '@apollo/client';
import { friendRequestsByReceiverID, getUser } from '../graphql/queries';
import { updateFriendRequest } from '../graphql/mutations';

export const useFriendRequests = (currentUserId) => {
  const [friendsData, setFriendsData] = useState([]);

  const fetchFriendRequests = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const { data } = await client.query({
        query: gql(friendRequestsByReceiverID),
        variables: { receiverID: currentUserId, filter: { status: { eq: "Pending" } } },
      });

      const friendRequests = data.friendRequestsByReceiverID.items;
      console.log("friend requests: ", friendRequests );
      const friendIds = friendRequests.map(request => request.senderID);

      const friendDetailsPromises = friendIds.map(friendId =>
        client.query({
          query: gql(getUser),
          variables: { id: friendId },
        })
      );

      
        const friendDetailsResponses = await Promise.all(friendDetailsPromises);
        const friendsDataWithRequestIds = friendRequests.map((request, index) => ({
          ...friendDetailsResponses[index].data.getUser,
          friendRequestId: request.id, 
        }));
        setFriendsData(friendsDataWithRequestIds);

    } catch (error) {
      console.error("Error fetching friend requests:", error);
      
    }
  }, [currentUserId]);

  const updateFriendRequestStatus = async (friendRequestId, status) => {
    try {
      await client.mutate({
        mutation: gql(updateFriendRequest),
        variables: { input: { id: friendRequestId, status } },
        refetchQueries: [
          {
            query: gql(friendRequestsByReceiverID),
            variables: { receiverID: currentUserId, filter: { status: { eq: "Pending" } } },
          },
        ],
      });

      setFriendsData(prev => prev.filter(friend => friend.friendRequestId !== friendRequestId));

      console.log(`Friend request ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error(`Error updating friend request status to ${status}:`, error);
      
    }
  };

  return {
    friendsData,
    fetchFriendRequests,
    updateFriendRequestStatus,
  };
};
