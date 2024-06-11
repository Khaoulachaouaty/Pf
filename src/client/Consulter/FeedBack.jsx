import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Snackbar,
  useTheme,
  Rating,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const FeedbackPage = () => {
  const theme = useTheme();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const predefinedMessages = [
    "Excellent service, je suis très satisfait !",
    "Besoin d'amélioration sur la rapidité de réponse.",
    "Très bon produit, mais besoin de plus de variété.",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback:", feedback);
    console.log("Rating:", rating);
    setFeedback("");
    setRating(0);
    setSubmitted(true);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: "center", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Nous apprécions vos avis
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Partagez votre opinion et évaluez votre expérience avec nous.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        
      >
        {submitted ? (
          <Typography variant="body1">
            Merci pour votre retour ! Nous apprécions votre contribution.
          </Typography>
        ) : (
          <>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
              sx={{ transition: "0.3s" }}
            />
            <TextField
              label="Votre feedback"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              {predefinedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => setFeedback(message)}
                  sx={{ mx: 1, my: 1 }}
                >
                  {message}
                </Button>
              ))}
            </Box>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Envoyer
            </Button>
          </>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Feedback envoyé avec succès !"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={{ mt: 2 }}
      />
    </Container>
  );
};

export default FeedbackPage;
