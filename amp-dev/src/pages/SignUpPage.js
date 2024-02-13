import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const CustomSignUp = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const signUpResponse = await Auth.signUp({
        username: email, // Using email as the username, adjust based on your needs
        password,
        attributes: {
          email,
          name,
        },
      });

      console.log('Successfully signed up:', signUpResponse);
      setIsSignUpComplete(true);
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      console.error('Error during sign-up:', error);
      setErrorMessage(error.message || 'An error occurred during sign-up');
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      console.log('Successfully confirmed sign-up');
      navigate('/login');
    } catch (error) {
      console.error('Error during confirmation:', error);
      setErrorMessage(error.message || 'An error occurred during confirmation');
    }
  };

  const styles = {
    container: {
      padding: '20px',
      margin: '20px',
      backgroundColor: '#87CEEB',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      marginTop: '10px',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    },
    errorMessage: {
      color: 'red',
      fontSize: '0.9em',
      marginTop: '5px',
    },
  };

  return (
    <div style={styles.container}>
      {/* <h2>Sign Up</h2> */}
      {!isSignUpComplete ? (
        <>
          <input
            type="text"
            placeholder="Name"
            style={styles.input}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            style={styles.input}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.input} onClick={handleSignUp}>
            Sign Up
          </button>
        </>
      ) : (
        <>
          <p>Sign-up successful! Check your email for a confirmation code.</p>
          <label style={styles.label}>Confirmation Code</label>
          <input
            type="text"
            placeholder="Confirmation Code"
            style={styles.input}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
          <button style={styles.input} onClick={handleConfirmSignUp}>
            Confirm Sign Up
          </button>
        </>
      )}

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default CustomSignUp;


