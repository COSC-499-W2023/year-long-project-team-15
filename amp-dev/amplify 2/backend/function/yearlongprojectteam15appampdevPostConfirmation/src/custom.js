/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const fetch = require('node-fetch'); 
exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger

const GRAPHQL_ENDPOINT = process.env.API_YEARLONGPROJECTTEAM15APPAMPDEV_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_YEARLONGPROJECTTEAM15APPAMPDEV_GRAPHQLAPIKEYOUTPUT;

const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name 
      email
    }
  }
`;

const variables = {
  input: {
    id: event.request.userAttributes.sub,
    name: event.request.userAttributes.name,
    email: event.request.userAttributes.email
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
