import {Amplify} from 'aws-amplify';
import awsExports from './aws-exports';
import {useState, useEffect} from 'react';

import "@aws-amplify/ui-react/styles.css" 
import {withAuthenticator, View, Text, Flex} from '@aws-amplify/ui-react';
Amplify.configure(awsExports); 

function App({user, signOut}) {
    return (
      <Flex direction="column" alignItems="center">
      {user ? (
        <View width="300px" padding="1rem" shadow="md" border="1px solid" borderColor="gray.200">
          <Text fontSize="xl" fontWeight="bold" marginBottom="1rem">
            User Profile
          </Text>
          <Text>
            <strong>Name:</strong> {user.attributes.name}
          </Text>
          <Text>
            <strong>Email:</strong> {user.attributes.email}
          </Text>
        </View>
      ) : (
        <Text fontSize="lg">Please sign in to view your profile.</Text>
      )}
    </Flex>
    );
  };

export default withAuthenticator(App);
