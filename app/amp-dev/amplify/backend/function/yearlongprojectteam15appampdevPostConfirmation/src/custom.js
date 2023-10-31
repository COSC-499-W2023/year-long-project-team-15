/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import {fetch} from 'node-fetch'; 
import { createUser } from '../../../../../src/graphql/mutations';
exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger

const GRAPHQL_ENDPOINT = process.env.API__yearlongprojectteam15appampdev_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_yearlongprojectteam15appampdev_GRAPHQLAPIKEYOUTPUT;

const variables = {
  input: {
    id: event.request.userAttributes.sub,
    email: event.request.userAttributes.email
  }
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

try {
  const res = await fetch(GRAPHQL_ENDPOINT, options);
  response.data = await res.json();

  console.log("GraphQL Response: ", response.data);

  if (response.data.errors) {
    response.statusCode = 400;
    console.error("GraphQL Errors: ", response.data.errors);
  }
} catch (error) {
  response.statusCode = 400;
  response.body = {
    errors: [
      {
        message: error.message,
        stack: error.stack,
      },
    ],
  };

  console.error("Error: ", error);
}

return {
  ...response,
  body: JSON.stringify(response.body),
};
};
