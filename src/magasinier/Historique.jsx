import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import { demandePRService } from "./../services/demandePR_service";
import { styled } from "@mui/material/styles";

const Historique = () => {
  const theme = useTheme();
  const [demandes, setDemandes] = useState({});
  const [filtre, setFiltre] = useState("Tous");

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.mode === "light" ? "#000" : "#fff",
    backgroundColor: theme.palette.mode === "light" ? "#f6f7f8" : "#262626",
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#f6f7f8" : "#262626",
  }));

  const loadAndGroupDemandes = async () => {
    try {
      const response = await demandePRService.getAllDemandePR();
      const filteredDemandes = response.data.filter((demande) => {
        // Filtrer selon le filtre sélectionné et le statut "Accepter"
        if (filtre === "Tous") return demande.done;
        return demande.done === filtre;
      });
      const groupedDemandes = groupDemandesByInterCode(filteredDemandes);
      setDemandes(groupedDemandes);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    loadAndGroupDemandes();
  }, [filtre]);

  const groupDemandesByInterCode = (demandes) => {
    const groupedDemandes = {};
    demandes.forEach((demande) => {
      const interCode =
        demande.ticket && typeof demande.ticket === "object"
          ? demande.ticket.interCode
          : demande.ticket;
      if (!groupedDemandes[interCode]) {
        groupedDemandes[interCode] = [];
      }
      groupedDemandes[interCode].push(demande);
    });
    return groupedDemandes;
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(90vh - 64px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="5px"
          sx={{ fontWeight: 500 }}
        >
          Liste historique des demandes
        </Typography>
        <Select
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          size="small"
          variant="outlined"
          style={{ marginBottom: 20, width: 250 }}
        >
          <MenuItem value="Tous">Tous</MenuItem>
          <MenuItem value="oui">Livrée</MenuItem>
          <MenuItem value="non">Renvoyée</MenuItem>
        </Select>
      </Box>

      <Box
        sx={{
          padding: "20px",
          borderRadius: "15px",
          flexWrap: "wrap",
          display: "flex",
          gap: "20px",
        }}
      >
        {Object.keys(demandes).map((interCode) => {
          const demandeGroup = demandes[interCode];
          const firstDemande = demandeGroup[0];
          const done = firstDemande.done;
          console.log(demandeGroup, "..........");
          return (
            <TableContainer
              key={interCode}
              component={Paper}
              sx={{
                backgroundColor:
                  theme.palette.mode === "light" ? "#fff" : "#262626",
                padding: "20px",
                borderRadius: "15px",
                width: 430,
                marginBottom: "20px", // Ajout de marges en bas pour séparer les conteneurs
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                <Typography sx={{ fontSize: 15, fontWeight: "bold", flexShrink: 0 }}>
                  Intervention: {interCode}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color:
                      done === "oui"
                        ? theme.palette.mode === "light"
                          ? "#217813"
                          : "#b4f6a0"
                        : theme.palette.mode === "light"
                        ? "#c90c0c"
                        : "#ffc5c5",
                    marginLeft: "auto", // Utilisation de marginLeft au lieu de ml pour la compatibilité
                    flexShrink: 0, // Empêche le rétrécissement excessif
                  }}
                >
                  {done === "oui" ? "Livrée" : "Renvoyée"}
                </Typography>
              </Box>
          
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Article</StyledTableCell>
                    <StyledTableCell align="center">Quantité demandée</StyledTableCell> {/* Alignement centré */}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {demandeGroup.map((articleDemande, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>
                        {articleDemande.etat === "Ancien"
                          ? articleDemande.article.nomArticle
                          : articleDemande.autreArt}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {articleDemande.quantiteDemande}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
          
        })}
      </Box>
    </Box>
  );
};

export default Historique;
