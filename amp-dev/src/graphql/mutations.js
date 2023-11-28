/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createFriendRequest = /* GraphQL */ `
  mutation CreateFriendRequest(
    $input: CreateFriendRequestInput!
    $condition: ModelFriendRequestConditionInput
  ) {
    createFriendRequest(input: $input, condition: $condition) {
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
export const updateFriendRequest = /* GraphQL */ `
  mutation UpdateFriendRequest(
    $input: UpdateFriendRequestInput!
    $condition: ModelFriendRequestConditionInput
  ) {
    updateFriendRequest(input: $input, condition: $condition) {
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
export const deleteFriendRequest = /* GraphQL */ `
  mutation DeleteFriendRequest(
    $input: DeleteFriendRequestInput!
    $condition: ModelFriendRequestConditionInput
  ) {
    deleteFriendRequest(input: $input, condition: $condition) {
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
export const createVideo = /* GraphQL */ `
  mutation CreateVideo(
    $input: CreateVideoInput!
    $condition: ModelVideoConditionInput
  ) {
    createVideo(input: $input, condition: $condition) {
      id
      uploadDate
      videoKey
      title
      description
      uploader {
        id
        email
        name
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
export const updateVideo = /* GraphQL */ `
  mutation UpdateVideo(
    $input: UpdateVideoInput!
    $condition: ModelVideoConditionInput
  ) {
    updateVideo(input: $input, condition: $condition) {
      id
      uploadDate
      videoKey
      title
      description
      uploader {
        id
        email
        name
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
export const deleteVideo = /* GraphQL */ `
  mutation DeleteVideo(
    $input: DeleteVideoInput!
    $condition: ModelVideoConditionInput
  ) {
    deleteVideo(input: $input, condition: $condition) {
      id
      uploadDate
      videoKey
      title
      description
      uploader {
        id
        email
        name
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
export const createVideoMessage = /* GraphQL */ `
  mutation CreateVideoMessage(
    $input: CreateVideoMessageInput!
    $condition: ModelVideoMessageConditionInput
  ) {
    createVideoMessage(input: $input, condition: $condition) {
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
export const updateVideoMessage = /* GraphQL */ `
  mutation UpdateVideoMessage(
    $input: UpdateVideoMessageInput!
    $condition: ModelVideoMessageConditionInput
  ) {
    updateVideoMessage(input: $input, condition: $condition) {
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
export const deleteVideoMessage = /* GraphQL */ `
  mutation DeleteVideoMessage(
    $input: DeleteVideoMessageInput!
    $condition: ModelVideoMessageConditionInput
  ) {
    deleteVideoMessage(input: $input, condition: $condition) {
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
