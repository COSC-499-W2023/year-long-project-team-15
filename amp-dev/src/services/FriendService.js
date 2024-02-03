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