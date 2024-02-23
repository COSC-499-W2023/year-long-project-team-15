import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Button, Container, TextField, InputAdornment, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const CustomSignUp = ({ onSignUpSuccess }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        setLoading(false);
        return;
      }

      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name,
        },
      });

      setIsSignUpComplete(true);
      setLoading(false);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during sign-up');
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    setLoading(true);
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      onSignUpSuccess();
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during confirmation');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
      {!isSignUpComplete ? (
        <>
          <Typography variant="h5" sx={{ color: '#212529', fontWeight: 'bold' }}>Signup</Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          )}
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput label="Password" value={password} showPassword={showPassword} onChange={(e) => setPassword(e.target.value)} onClickIcon={() => setShowPassword(!showPassword)} />
          <PasswordInput label="Confirm Password" value={confirmPassword} showPassword={showConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onClickIcon={() => setShowConfirmPassword(!showConfirmPassword)} />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSignUp} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ mt: 2, color: 'black' }}>Sign-up successful! Check your email for a confirmation code.</Typography>
          <TextField label="Confirmation Code" fullWidth margin="normal" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleConfirmSignUp} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Confirm Sign Up"}
          </Button>
        </>
      )}
    </Container>
  );
};

const PasswordInput = ({ label, value, showPassword, onChange, onClickIcon }) => (
  <TextField
    fullWidth
    label={label}
    variant="outlined"
    margin="normal" 
    type={showPassword ? 'text' : 'password'}
    value={value}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={onClickIcon}>
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

export default CustomSignUp;
