import logo from './logo.svg';
import './App.css'; 
import {Amplify} from 'aws-amplifiy';
import "@aws-amplify/ui-react/styles.css" 
import { Authenticator, signOut } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';


Amplify.configure(awsExports);


function App({user, signOut}) {
  return (
    <Authenticator>
    {({ signOut, user }) => (
      <main>
        <h1>Hello {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
      </main>
    )}
  </Authenticator>
  );
}

export default App;
