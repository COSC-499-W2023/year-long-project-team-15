/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getFriendRequest = /* GraphQL */ `
  query GetFriendRequest($id: ID!) {
    getFriendRequest(id: $id) {
      id
      date
      status
      sender {
        id
        email
        password
        firstName
        lastName
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        password
        firstName
        lastName
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
export const listFriendRequests = /* GraphQL */ `
  query ListFriendRequests(
    $id: ID
    $filter: ModelFriendRequestFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFriendRequests(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        date
        status
        senderID
        receiverID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVideo = /* GraphQL */ `
  query GetVideo($id: ID!) {
    getVideo(id: $id) {
      id
      uploadDate
      videoKey
      title
      description
      uploader {
        id
        email
        password
        firstName
        lastName
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      uploaderID
      videoMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listVideos = /* GraphQL */ `
  query ListVideos(
    $id: ID
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listVideos(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        uploadDate
        videoKey
        title
        description
        uploaderID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVideoMessage = /* GraphQL */ `
  query GetVideoMessage($id: ID!) {
    getVideoMessage(id: $id) {
      id
      date
      status
      sender {
        id
        email
        password
        firstName
        lastName
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      senderID
      receiver {
        id
        email
        password
        firstName
        lastName
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      receiverID
      video {
        id
        uploadDate
        videoKey
        title
        description
        uploaderID
        createdAt
        updatedAt
        __typename
      }
      videoID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listVideoMessages = /* GraphQL */ `
  query ListVideoMessages(
    $id: ID
    $filter: ModelVideoMessageFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listVideoMessages(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        date
        status
        senderID
        receiverID
        videoID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const friendRequestsBySenderID = /* GraphQL */ `
  query FriendRequestsBySenderID(
    $senderID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFriendRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    friendRequestsBySenderID(
      senderID: $senderID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        date
        status
        senderID
        receiverID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const friendRequestsByReceiverID = /* GraphQL */ `
  query FriendRequestsByReceiverID(
    $receiverID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFriendRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    friendRequestsByReceiverID(
      receiverID: $receiverID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        date
        status
        senderID
        receiverID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const videosByUploaderID = /* GraphQL */ `
  query VideosByUploaderID(
    $uploaderID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    videosByUploaderID(
      uploaderID: $uploaderID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        uploadDate
        videoKey
        title
        description
        uploaderID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const videoMessagesBySenderID = /* GraphQL */ `
  query VideoMessagesBySenderID(
    $senderID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVideoMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    videoMessagesBySenderID(
      senderID: $senderID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        date
        status
        senderID
        receiverID
        videoID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const videoMessagesByReceiverID = /* GraphQL */ `
  query VideoMessagesByReceiverID(
    $receiverID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVideoMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    videoMessagesByReceiverID(
      receiverID: $receiverID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        date
        status
        senderID
        receiverID
        videoID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const videoMessagesByVideoID = /* GraphQL */ `
  query VideoMessagesByVideoID(
    $videoID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVideoMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    videoMessagesByVideoID(
      videoID: $videoID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        date
        status
        senderID
        receiverID
        videoID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      password
      firstName
      lastName
      dateJoined
      sentFriendRequests {
        nextToken
        __typename
      }
      receivedFriendRequests {
        nextToken
        __typename
      }
      uploadedVideos {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $id: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        email
        password
        firstName
        lastName
        dateJoined
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
