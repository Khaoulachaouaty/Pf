import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PasswordResetSent = () => {
  let navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ fontWeight: 'medium', color: '#333' }}
        >
          Email envoyé
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 2, color: '#333' }}
        >
          Un email pour réinitialiser votre mot de passe a été envoyé à votre adresse email.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '20px',
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s',
              padding: '10px 40px',
              '&:hover': {
                backgroundColor: '#555',
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={goToLogin}
          >
            Retour à la connexion
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default PasswordResetSent;
