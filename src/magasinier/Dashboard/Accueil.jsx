import { Box, Typography, useTheme } from "@mui/material";
import Row1 from "./row1";
import Row2 from "./row2";
import Row3 from "./row3";
import Pie from "./pie";

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column", // Aligner les enfants verticalement
      backgroundColor: theme.palette.mode === "light" ? "#f6f6f6" : "#0f0f0f",
      minHeight: "100vh", // Assurer que le contenu s'étend à la hauteur de la fenêtre
      //padding: 2, // Ajouter un peu de marge autour du contenu
    }}>
      <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // Ajout de cette ligne pour aligner verticalement les éléments
          marginBottom: 1,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          //margin="5px"
          sx={{
            fontWeight: 500, // épaisseur de la police
          }}
        >
          Tableau de bord
        </Typography>
      </Box>
      <Row1 />
      <Row2 />
    
      </div>
    </Box>
  );
};

export default Dashboard;
