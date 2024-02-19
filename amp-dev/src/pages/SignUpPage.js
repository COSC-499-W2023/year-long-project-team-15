// CustomSignUp.js
import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const CustomSignUp = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }

      const signUpResponse = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name,
        },
      });

      console.log('Successfully signed up:', signUpResponse);
      setIsSignUpComplete(true);
      setErrorMessage('');
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
      setErrorMessage(
        error.message || 'An error occurred during confirmation'
      );
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
    button: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#white',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
  };

  // Use the same hover effect for the button
  styles.button[':hover'] = {
    backgroundColor: '#1bdde8',
  };

  return (
    <div style={styles.container}>
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
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                style={styles.input}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item>
              <IconButton
                size="small"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                style={styles.input}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item>
              <IconButton
                size="small"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            style={styles.button}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
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
          <Button
            variant="contained"
            style={styles.button}
            onClick={handleConfirmSignUp}
          >
            Confirm Sign Up
          </Button>
        </>
      )}

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default CustomSignUp;
