import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Redirection vers la page précédente
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#d6d6d6", // Arrière-plan gris
        color: theme.palette.text.primary,
        padding: theme.spacing(4),
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Oups ! Page non trouvée
      </Typography>
      <Typography paragraph>
        Désolé, la page que vous recherchez semble avoir été supprimée ou
        n'existe pas.
      </Typography>
      <Typography paragraph>
        Veuillez vérifier l'URL ou retourner à la page précédente.
      </Typography>
      {/* Bouton pour retourner à la page précédente */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        sx={{
          mt: 2, // Espacement vers le haut
          borderRadius: "20px", // Coins arrondis
          padding: "10px 20px", // Rembourrage
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)", // Ombre légère
          transition: "background-color 0.3s", // Transition douce de la couleur de fond
          backgroundColor: "#5f51da", // Couleur de fond
          "&:hover": {
            backgroundColor: "#4a3cb4", // Couleur de fond au survol
            boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.2)", // Ombre légèrement augmentée au survol
          },
        }}
      >
        Retour à la page précédente
      </Button>
    </Box>
  );
};

export default NotFound;
