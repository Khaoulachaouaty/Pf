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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { demandePRService } from "../../services/demandePR_service";
import { demandeurService } from "../../services/demandeur_service";
import { styled } from "@mui/material/styles";

const Historique = () => {
  const theme = useTheme();
  const [demandes, setDemandes] = useState({});
  const [demandeurInfos, setDemandeurInfos] = useState({});
  const [filtre, setFiltre] = useState("Tous");

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#f6f7f8" : "#262626",
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.mode === "light" ? "#000" : "#fff",
  }));

  const loadAndGroupDemandes = async () => {
    try {
      const response = await demandePRService.getAllDemandePR();
      const filteredDemandes = response.data.filter((demande) => {
        if(demande.done){
          if (filtre === "Tous") {
            return ["Accepter", "Annuler"].includes(demande.statutDemande);
          } else if (filtre === "Accepter") {
            return demande.statutDemande === "Accepter";
          } else if (filtre === "Annuler") {
            return demande.statutDemande === "Annuler";
          } else if (filtre === "oui") {
            return demande.done === "oui";
          } else if (filtre === "non") {
            return demande.done === "non";
          }
        }
        return false;
      });
      const groupedDemandes = groupDemandesByInterCode(filteredDemandes);
      setDemandes(groupedDemandes);
      const infos = await getAllDemandeurInfos(groupedDemandes);
      setDemandeurInfos(infos);
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

  const getAllDemandeurInfos = async (demandes) => {
    const infos = {};
    for (const interCode in demandes) {
      const demandeGroup = demandes[interCode];
      const firstDemande = demandeGroup[0];
      const demandeurId = firstDemande.ticket.demandeur;
      try {
        const response = await demandeurService.getDemandeur(demandeurId);
        infos[interCode] = response.data;
      } catch (error) {
        console.error(
          `Error fetching demandeur data for interCode ${interCode}:`,
          error
        );
        infos[interCode] = null;
      }
    }
    return infos;
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme.palette.mode === "light" ? "#f6f6f6" : "#0f0f0f",
        minHeight: "80vh",
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
          Historique des Demandes des Pièces de Rechange
        </Typography>
        <Box sx={{ marginBottom: "20px", width: 150 }}>
          <FormControl fullWidth>
            <Select
              labelId="filtre-statut-label"
              size="small"
              id="filtre-statut"
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              displayEmpty
            >
              <MenuItem value="Tous">Tous</MenuItem>
              <MenuItem value="Accepter">Acceptées</MenuItem>
              <MenuItem value="oui">Livrée</MenuItem>
              <MenuItem value="non">Renvoyée</MenuItem>
              <MenuItem value="Annuler">Annulées</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
          const demandeurInfo = demandeurInfos[interCode];
          let nomSociete = "";
          let nomUtilisateur = "";
          let prenomUtilisateur = "";
          let eqptDesignation = "";

          if (demandeurInfo && demandeurInfo.client) {
            nomSociete = demandeurInfo.client.nomSociete;
            nomUtilisateur = demandeurInfo.user.nom;
            prenomUtilisateur = demandeurInfo.user.prenom;
          } else if (typeof firstDemande.ticket.demandeur === "object") {
            nomSociete = firstDemande.ticket.demandeur.client.nomSociete;
            nomUtilisateur = firstDemande.ticket.demandeur.user.nom;
            prenomUtilisateur = firstDemande.ticket.demandeur.user.prenom;
          }

          if (firstDemande.ticket.equipement) {
            eqptDesignation = firstDemande.ticket.equipement.eqptDesignation;
          }

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
                position: "relative",
              }}
            >
              <Typography sx={{ fontSize: "15px", mb: 1 }}>
                <b>Intervention:</b> {interCode}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: theme.palette.mode === "light" ? "#bf5037" : "#f7e8dd",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                {firstDemande.statutDemande === "Accepter" ? (
                  firstDemande.done === "oui" ? (
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#80BFFF" : "#007AFF",
                      }}
                    >
                      Livrée
                    </span>
                  ) : (
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#FFA07A" : "#FF4500",
                      }}
                    >
                      Renvoyée
                    </span>
                  )
                ) : firstDemande.statutDemande === "Annuler" ? (
                  <span
                    style={{
                      color:
                        theme.palette.mode === "dark" ? "#FFA07A" : "#FF4500",
                    }}
                  >
                    Annulée
                  </span>
                ) : null}
              </Typography>

              <Typography sx={{ fontSize: "15px", mb: 1 }}>
                <b> Société:</b> {nomSociete}({prenomUtilisateur}{" "}
                {nomUtilisateur})
              </Typography>

              <Typography sx={{ fontSize: "15px", mb: 2 }}>
                <b>Equipement:</b> {eqptDesignation}
              </Typography>
              <Table sx={{ minWidth: 300 }}>
                <TableHead
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light" ? "#f6f7f8" : "#262626",
                  }}
                >
                  <TableRow>
                    <StyledTableCell>Article</StyledTableCell>
                    <StyledTableCell>Quantité</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandeGroup.map((articleDemande, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        {articleDemande.etat === "Ancien"
                          ? articleDemande.article.nomArticle
                          : articleDemande.autreArt}
                      </StyledTableCell>
                      <StyledTableCell>
                        {articleDemande.quantiteDemande}
                      </StyledTableCell>
                    </StyledTableRow>
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
