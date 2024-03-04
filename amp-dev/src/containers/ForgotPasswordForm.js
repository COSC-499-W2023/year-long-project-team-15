import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';
import { Auth } from 'aws-amplify';

const ForgotPasswordForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      setError('');

      // Call the forgotPassword function from AWS Cognito
      await Auth.forgotPassword(email);
      console.log('Forgot password verification code sent successfully');

      // Close the current form and open the verification form
      onClose('verification');
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      setError(error.message || 'Failed to send reset email. Please check the email address.');
      setLoading(false);
    }
  };


  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError('');

      // Call the forgotPasswordSubmit function from AWS Cognito with verification code and new password
      await Auth.forgotPasswordSubmit(email, verificationCode, newPassword);

      console.log('Password reset successful');
      // You might want to show a success message or close the modal and redirect the user
      onClose('success');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to reset password. Please check your inputs.');
      setLoading(false);
    }
  };

  // Debugging logs
  console.log('ForgotPasswordForm rendering with onClose:', onClose);

  return (
    <div>
      <h2>Forgot Password</h2>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Step 1: Enter Email */}
      {(!verificationCode && !newPassword) && (
        <>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: 'primary.main', ':hover': { bgcolor: 'primary.dark' } }}
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Verification Code'}
          </Button>
        </>
      )}

      {/* Step 2: Enter Verification Code and New Password */}
      {verificationCode && newPassword && (
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
            onClick={handleVerifyCode}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
          </Button>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
