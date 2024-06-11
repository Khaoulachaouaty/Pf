import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Account_service } from './../services/account_service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await Account_service.sendResetPasswordEmail(email);
      navigate('/mot-de-passe-envoyer');
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    }
    setLoading(false);
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
          Mot de passe oublié
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
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
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Envoyer'}
          </Button>
          {error && (
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: '#ff0000' }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default ForgotPassword;
