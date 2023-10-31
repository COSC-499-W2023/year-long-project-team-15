/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const fetch = require("node-fetch");

exports.handler = async(event, context) => {
  const GRAPHQL_ENDPOINT = process.env.API_BLURVID_GRAPHQLAPIENDPOINTOUTPUT;
  const GRAPHQL_API_KEY = process.env.API_BLURVID_GRAPHQLAPIKEYOUTPUT;
  
  const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!, $condition: ModelUserConditionInput) {
    createUser(input: $input, condition: $condition) {
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
  let date = new Date();

  const variables = {
    input: {
      id: event.request.userAttributes.sub,
      email: event.request.userAttributes.email,
      password: event.request.userAttributes.password,
      firstName: event.request.userAttributes.given_name,
      lastName: event.request.userAttributes.family_name,
      dateJoined: date.toISOString(),
    },
  };

  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: createUser, variables }),
  };

  const response = {};

  try{
    const res = await fetch(GRAPHQL_ENDPOINT, options);
    response.data = await res.json();
    if(response.data.errors) response.statusCode = 400;
  }catch(error) {
    response.statusCode = 400;
    response.body = {
      errors: [
        {
          message: error.message,
          stack: error.stack,
        },
      ],
    };
  }


  return {
    ...response,
    body: JSON.stringify(response.body),
  };
}
