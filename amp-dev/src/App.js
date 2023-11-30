import {Amplify, API, Auth} from 'aws-amplify';
import * as queries from './graphql/queries'; 
import awsExports from './aws-exports';
import {useState, useEffect} from 'react';
import EditProfileForm from './EditProfile';

import "@aws-amplify/ui-react/styles.css" 
import {withAuthenticator, View, Text, Flex} from '@aws-amplify/ui-react';
Amplify.configure(awsExports); 

function App({user, signOut}) {  
  // Make sure to set orginal state = to an empty object, if you do null, data will render as undefined before data can load. 
  const [userData, setUserData] = useState({});
  // Async function to fetch userdata on initial state mounting, will only update during refreshs 
  // Use subscriptions to see realtime changes will graphQL api  
  useEffect(() => {  
    const fetchUserData = async () => { 
      try {  
        const user = await Auth.currentAuthenticatedUser(); 
        const response = await API.graphql({ 
          query: queries.getUser, 
          variables: {id: user.attributes.sub}
        }); 
        const dbData = response.data.getUser;  
        console.log(dbData);
        setUserData(dbData);
      } catch (error) { 
        console.error("Err fetching user data from Dynamo ", error); 
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
        <EditProfileForm>

        </EditProfileForm>
    </Flex>
    );
  };

export default withAuthenticator(App);
