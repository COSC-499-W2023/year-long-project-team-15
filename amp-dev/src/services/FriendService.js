import client from '../apolloClient';
import { gql } from '@apollo/client';
import { friendRequestsBySenderID, friendRequestsByReceiverID, getUser } from '../graphql/queries';

export const fetchFriendRequests = async (userId) => {
  const [sentRequestsResponse, receivedRequestsResponse] = await Promise.all([
    client.query({
      query: gql(friendRequestsBySenderID),
      variables: { senderID: userId, filter: { status: { eq: "Accepted" } } },
      fetchPolicy: 'cache-first'

    }),
    client.query({
      query: gql(friendRequestsByReceiverID),
      variables: { receiverID: userId, filter: { status: { eq: "Accepted" } } },
      fetchPolicy: 'cache-first'
    })
  ]);

  return {
    sentRequests: sentRequestsResponse.data.friendRequestsBySenderID.items,
    receivedRequests: receivedRequestsResponse.data.friendRequestsByReceiverID.items
  };
};

export const fetchSpecificFriendRequest = async (currentUserId, friendId) => {
  try {
     const sentRequestsResponse = await client.query({
      query: gql(friendRequestsBySenderID),
      variables: { 
        senderID: currentUserId, 
        filter: { receiverID: { eq: friendId }, status: { eq: "Accepted" } }
      },
      fetchPolicy: 'network-only'
    });

    const receivedRequestsResponse = await client.query({
      query: gql(friendRequestsByReceiverID),
      variables: { 
        receiverID: currentUserId, 
        filter: { senderID: { eq: friendId }, status: { eq: "Accepted" } }
      },
      fetchPolicy: 'network-only'
    });

    const combinedRequests = [
      ...sentRequestsResponse.data.friendRequestsBySenderID.items,
      ...receivedRequestsResponse.data.friendRequestsByReceiverID.items,
    ];

    const requestIds = combinedRequests.map(request => request.id);
    
    return requestIds;
  } catch (error) {
    console.error("Error fetching specific friend request:", error);
    throw new Error("Failed to fetch friend request IDs.");
  }
};



export const fetchFriendDetails = async (friendIds) => {
  const friendDetailsPromises = friendIds.map(friendId =>
    client.query({
      query: gql(getUser),
      variables: { id: friendId },
      fetchPolicy: 'cache-first'
    })
  );

  const friendDetailsResponses = await Promise.all(friendDetailsPromises);
  return friendDetailsResponses.map(response => response.data.getUser);
};