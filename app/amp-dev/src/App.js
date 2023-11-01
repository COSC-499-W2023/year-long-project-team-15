import {Amplify, Auth, API, graphqlOperation} from 'aws-amplify';
import {getUser} from './graphql/queries'; 
import awsExports from './aws-exports';
import {useState, useEffect} from 'react';

import "@aws-amplify/ui-react/styles.css" 
import {withAuthenticator, View, Text, Flex} from '@aws-amplify/ui-react';
Amplify.configure(awsExports); 

function App({user, signOut}) { 
  const [userDB, setUserDB] = useState(null);

  // Async function to fetch userdata on initial state mounting, will only update during refreshs 
  // Use subscriptions to see realtime changes will graphQL api 
  const fetchUserData = async () => { 
    try { 
      const response = await API.graphql(graphqlOperation(getUser)); 
      const userDBData = response.data.getUser;  
      setUserDB(userDBData); 
    } catch (error) { 
      console.error("Err fetching user data from Dynamo ", error); 
    }    
  };

  useEffect(() => {  
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
            <strong>Name:</strong> {user.name}
          </Text> 
          <Text>
            <strong>Email:</strong> {user.email}
          </Text>  
          <Text>
            <strong>CreatedAt:</strong> {user.createdAt}
          </Text> 
          <Text>
            <strong>UpdatedAt:</strong> {user.updateAt}
          </Text> 
        </View>
    </Flex>
    );
  };

export default withAuthenticator(App);
