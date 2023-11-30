import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Account from './pages/Account'
Amplify.configure(awsExports);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/accountpage" element={<Account />} />
    </Routes>
  );
}

export default withAuthenticator(App);
