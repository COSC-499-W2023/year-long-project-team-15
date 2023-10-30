import logo from './logo.svg';
import './App.css';

import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <h1>Welcome to BlurVid!</h1>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
