// CustomLogin.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';

const CustomLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      console.log('Successfully logged in');
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
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
      <input
        type="text"
        placeholder="Email"
        style={styles.input}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          style={{ ...styles.input, marginRight: '5px' }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </div>

      <Button variant="contained" style={styles.button} onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default CustomLogin;
