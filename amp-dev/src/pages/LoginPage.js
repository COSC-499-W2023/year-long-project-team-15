import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ForgotPasswordForm from '../containers/ForgotPasswordForm';

const CustomLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
      console.log('Successfully logged in');
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleForgotPasswordClick = () => {
    // Show the Forgot Password form
    navigate('/ForgotPasswordForm');
    setShowForgotPasswordForm(true);
  };
  
  const handleCloseForgotPasswordForm = () => {
    // Close the Forgot Password form
    setShowForgotPasswordForm(false);
  };
  

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: 2, 
        backgroundColor: 'white', 
        borderRadius: 2, 
        boxShadow: 3 
      }}
      onKeyDown={handleKeyDown} // Added event listener for Enter key
    >
      <Typography variant="h5" sx={{ color: '#212529', fontWeight: 'bold' }}>
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, bgcolor: 'primary.main', ':hover': { bgcolor: 'primary.dark' } }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1, bgcolor: 'white', color: 'black', ':hover': { bgcolor: '#C0C0C0' }, width: '50%', height: '30px', mx: 'auto', fontSize: '12px' }}
        onClick={handleForgotPasswordClick}
        disabled={loading}
      >
        {'Forgot Password?'}
      </Button>

      {showForgotPasswordForm && (
        <ForgotPasswordForm onClose={handleCloseForgotPasswordForm} />
      )}
    </Container>
  );
};

export default CustomLogin;
