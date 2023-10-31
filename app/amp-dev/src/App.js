import "@aws-amplify/ui-react/styles.css" 
import {withAuthenticator} from '@aws-amplify/ui-react';

function App({user, signOut}) {
    return (
      <>
        <h1>Hello {user.attributes.name}, </h1>
        <button onClick={signOut}>Sign out</button>
      </>
    );
  }

export default withAuthenticator(App);
