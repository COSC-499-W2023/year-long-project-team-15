import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Alert, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [loadingResetPassword, setLoadingResetPassword] = useState(false);
  const [error, setError] = useState('');
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    try {
      setLoadingSendCode(true);
      setError('');

      if (!isEmailValid(email)) {
        setError('Please enter a valid email address.');
        setLoadingSendCode(false);
        return;
      }

      // Call the forgotPassword function from AWS Cognito
      await Auth.forgotPassword(email);
      console.log('Forgot password verification code sent successfully');
      setVerificationCodeSent(true);
      setLoadingSendCode(false);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      setError(error.message || 'Failed to send reset email. Please check the email address.');
      setLoadingSendCode(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoadingResetPassword(true);
      setError('');

      await Auth.forgotPasswordSubmit(email, verificationCode, newPassword);

      console.log('Password reset successful');
      navigate('/login'); // Redirect the user back to the login page
      onClose('success');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to reset password. Please check your inputs.');
      setLoadingResetPassword(false);
    }
  };

  console.log('ForgotPasswordForm rendering with onClose:', onClose);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Enter Email */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Verification Code and New Password */}
      {verificationCodeSent && (
        <>
          <TextField
            label="Verification Code"
            variant="outlined"
            fullWidth
            margin="normal"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: 'primary.main', ':hover': { bgcolor: 'primary.dark' } }}
            onClick={handleVerifyCode}
            disabled={loadingResetPassword}
          >
            {loadingResetPassword ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
          </Button>
        </>
      )}

      {/* Button for Sending Verification Code */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, bgcolor: 'primary.main', ':hover': { bgcolor: 'primary.dark' } }}
        onClick={handleForgotPassword}
        disabled={loadingSendCode || verificationCodeSent}
      >
        {loadingSendCode ? <CircularProgress size={24} color="inherit" /> : 'Send Verification Code'}
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;
