/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      email
      name
      dateJoined
      sentFriendRequests {
        nextToken
        __typename
      }
      receivedFriendRequests {
        nextToken
        __typename
      }
      sentVideoMessages {
        nextToken
        __typename
      }
      receivedVideoMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      email
      name
      dateJoined
      sentFriendRequests {
        nextToken
        __typename
      }
      receivedFriendRequests {
        nextToken
        __typename
      }
      sentVideoMessages {
        nextToken
        __typename
      }
      receivedVideoMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      email
      name
      dateJoined
      sentFriendRequests {
        nextToken
        __typename
      }
      receivedFriendRequests {
        nextToken
        __typename
      }
      sentVideoMessages {
        nextToken
        __typename
      }
      receivedVideoMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateFriendRequest = /* GraphQL */ `
  subscription OnCreateFriendRequest(
    $filter: ModelSubscriptionFriendRequestFilterInput
  ) {
    onCreateFriendRequest(filter: $filter) {
      id
      date
      status
      sender {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      receiverID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateFriendRequest = /* GraphQL */ `
  subscription OnUpdateFriendRequest(
    $filter: ModelSubscriptionFriendRequestFilterInput
  ) {
    onUpdateFriendRequest(filter: $filter) {
      id
      date
      status
      sender {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      receiverID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteFriendRequest = /* GraphQL */ `
  subscription OnDeleteFriendRequest(
    $filter: ModelSubscriptionFriendRequestFilterInput
  ) {
    onDeleteFriendRequest(filter: $filter) {
      id
      date
      status
      sender {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      receiverID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateVideoMessage = /* GraphQL */ `
  subscription OnCreateVideoMessage(
    $filter: ModelSubscriptionVideoMessageFilterInput
  ) {
    onCreateVideoMessage(filter: $filter) {
      id
      date
      title
      description
      sender {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      receiverID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateVideoMessage = /* GraphQL */ `
  subscription OnUpdateVideoMessage(
    $filter: ModelSubscriptionVideoMessageFilterInput
  ) {
    onUpdateVideoMessage(filter: $filter) {
      id
      date
      title
      description
      sender {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      receiverID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteVideoMessage = /* GraphQL */ `
  subscription OnDeleteVideoMessage(
    $filter: ModelSubscriptionVideoMessageFilterInput
  ) {
    onDeleteVideoMessage(filter: $filter) {
      id
      date
      title
      description
      sender {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        name
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      receiverID
      createdAt
      updatedAt
      __typename
    }
  }
`;
