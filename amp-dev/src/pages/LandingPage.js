import React, { useState } from "react";
import { Box, Typography, CssBaseline } from "@mui/material";
import CustomLogin from "./LoginPage";
import CustomSignUp from "./SignUpPage";
import DeclineButton from '../components/DeclineButton';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Box sx={{ 
        bgcolor: '#2c313c', 
        color: 'white', 
        height: '100vh', 
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3 
    }}>
      <CssBaseline />
      <Typography variant="h1" component="h1" sx={{ color: 'white', textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
        BlurVid
      </Typography>
      <Box sx={{ display: 'flex', '& button': { mx: 2, my: 0, fontSize: '1.25rem' } }}> 
        {/* mx for horizontal margin, my for vertical margin */}
        <DeclineButton label="login" onClick={() => setShowLogin(true)} sx={{ mx: 2, my: 1 }}/>
        <DeclineButton label="signup" onClick={() => setShowLogin(false)} sx={{ mx: 2, my: 1 }}/>
      </Box>
      <Box sx={{ mt: 1, width: '100%', maxWidth: 400 }}> 
        {showLogin ? <CustomLogin /> : <CustomSignUp />}
      </Box>
    </Box>
  );
};

export default LandingPage;
