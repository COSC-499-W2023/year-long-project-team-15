import { Amplify, Auth } from 'aws-amplify';
import awsExports from './aws-exports';
import { useState, useEffect } from 'react';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator, View, Text, Flex } from '@aws-amplify/ui-react';
import client from './apolloClient'; // Import Apollo Client
import { gql } from '@apollo/client';
import * as queries from './graphql/queries';

Amplify.configure(awsExports);

function App({ user, signOut }) {
const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        const response = await client.query({
          query: gql(queries.getUser),
          variables: { id: authenticatedUser.attributes.sub },
          fetchPolicy: 'network-only' // Adjust fetch policy as needed
        });
        setUserData(response.data.getUser);
      } catch (error) {
        console.error("Error fetching user data with Apollo Client", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Flex direction="column" alignItems="center">
        <View width="300px" padding="1rem" shadow="md" border="1px solid" borderColor="gray.200">
          <Text fontSize="xl" fontWeight="bold" marginBottom="1rem">
            User Profile From AWS Auth Table
          </Text>
          <Text>
            <strong>Name:</strong> {user.attributes.name}
          </Text>
          <Text>
            <strong>Email:</strong> {user.attributes.email}
          </Text> 
        </View> 
        <View width="300px" padding="1rem" shadow="md" border="1px solid" borderColor="gray.200">
          <Text fontSize="xl" fontWeight="bold" marginBottom="1rem">
            User Profile From AWS Dynamo DB Table 
          </Text>
          <Text>
            <strong>Name:</strong> {userData.name}
          </Text> 
          <Text>
            <strong>Email:</strong> {userData.email}
          </Text>  
          <Text>
            <strong>CreatedAt:</strong> {userData.createdAt}
          </Text> 
          <Text>
            <strong>UpdatedAt:</strong> {userData.updatedAt}
          </Text> 
    </View>
        <button onClick={signOut}>Sign out</button>
    </Flex>
  );
};

export default withAuthenticator(App);
