import logo from './logo.svg';
import './App.css';

import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

function App() {
  return (
    <div className="App">
      <h1>Welcome to BlurVid!</h1>
      
    </div>
  );
}

export default withAuthenticator(App);
