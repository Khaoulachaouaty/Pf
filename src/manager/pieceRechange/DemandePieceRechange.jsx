import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Dialog,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import { demandePRService } from "../../services/demandePR_service";
import { demandeurService } from "../../services/demandeur_service";
import { styled } from "@mui/material/styles";
import { articleService } from "../../services/article_service";
import { pieceRechangeService } from "../../services/pieceRechange_service";
import LinkIcon from "@mui/icons-material/Link";
import { adminService } from "../../services/equipement_service";

const DemandePieceRechange = () => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [demandes, setDemandes] = useState({});
  const [demandeurInfos, setDemandeurInfos] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [interCodeToProcess, setInterCodeToProcess] = useState("");
  const [nouveauxQuantitesPR, setNouveauxQuantitesPR] = useState({});
  const [filtre, setFiltre] = useState("Tous");

  const openDialog = (interCode) => {
    setInterCodeToProcess(interCode);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setConfirmationMessage(""); // Réinitialisation de la valeur de ConfirmationMessage lors de la fermeture du dialogue
  };

  const updateDemandesStatut = async (interCode, nouveauStatut) => {
    try {
      console.log("Updating demandes statut...");
      await demandePRService.updateStatut(interCode, nouveauStatut);
      setDemandes((prevDemandes) => ({
        ...prevDemandes,
        [interCode]: prevDemandes[interCode].map((demande) => ({
          ...demande,
          statutDemande: nouveauStatut,
        })),
      }));
      handleSnackbarOpen(`Demandes mises à jour avec succès.`, "success");
    } catch (error) {
      console.error("Error updating demandes statut:", error);
      handleSnackbarOpen(
        `Erreur lors de la mise à jour des demandes.`,
        "error"
      );
    }
  };

  console.log(demandes);

  const processDemande = async (nouveauStatut) => {
    try {
      if (nouveauStatut === "Annuler" || nouveauStatut === "Accepter") {
        await updateDemandesStatut(interCodeToProcess, nouveauStatut);
  
        const demandeGroup = demandes[interCodeToProcess];
  
        if (nouveauStatut === "Accepter") {
          const hasNewArticles = demandeGroup.some(
            (demande) => demande.etat === "Nouveau"
          );
  
          if (hasNewArticles) {
            const equipement = demandeGroup[0].ticket.equipement;
  
            const data = demandeGroup
              .filter((demande) => demande.etat === "Nouveau")
              .reduce((acc, demande) => {
                acc[demande.codeDemande] =
                  nouveauxQuantitesPR[demande.codeDemande] !== undefined
                    ? nouveauxQuantitesPR[demande.codeDemande]
                    : 1;
                return acc;
              }, {});
  
            await demandePRService.updateQtePR(interCodeToProcess, data);
  
            const updatedDemandes = await demandePRService.getAllDemandePR();
            const groupedDemandes = groupDemandesByInterCode(updatedDemandes.data);
            const updatedDemande0 = groupedDemandes[interCodeToProcess];
  
            for (const demande of updatedDemande0) {
              if (demande.etat === "Nouveau") {
                const autreArt = demande.autreArt;
  
                if (autreArt) {
                  const ajoutArticle = {
                    nomArticle: autreArt,
                    marqueArticle: "",
                    qteArticle: 0,
                  };
                  const article = await articleService.addArticle(ajoutArticle);
  
                  await demandePRService.updateFinale(demande.codeDemande, article.data.codeArticle);
  
                  const piece = {
                    id: {
                      codeArticle: article.data.codeArticle,
                      eqptCode: equipement.eqptCode,
                    },
                    eqprQte: data[demande.codeDemande],  // Correct quantity from data
                    equipement: equipement,
                    article: article.data,
                  };
  
                  await pieceRechangeService.addPieceRechange(piece);
                } else {
                  const piece = {
                    id: {
                      codeArticle: demande.article.codeArticle,
                      eqptCode: equipement.eqptCode,
                    },
                    eqprQte: data[demande.codeDemande],  // Correct quantity from data
                    equipement: equipement,
                    article: demande.article,
                  };
  
                  await pieceRechangeService.addPieceRechange(piece);
  
                  await demandePRService.updateFinale(demande.codeDemande, demande.article.codeArticle);
                }
                await demandePRService.updateTestQteStock(interCodeToProcess);
                loadAndGroupDemandes();
              }
            }
          } else {
            await demandePRService.updateTestQteStock(interCodeToProcess);
            const updatedDemandes = await demandePRService.getAllDemandePR();
            const groupedDemandes = groupDemandesByInterCode(updatedDemandes.data);
            setDemandes(groupedDemandes);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du traitement de la demande:", error);
      handleSnackbarOpen(`Erreur lors du traitement de la demande.`, "error");
    }
  };
  
  

  const handleSnackbarOpen = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  // const StyledTableRow = styled(TableRow)(({ theme }) => ({
  //   backgroundColor: theme.palette.mode === "light" ? "#fff" : "#262626",
  //   "&:hover": {
  //     backgroundColor: theme.palette.mode === "light" ? "#dae8ff" : "#333438",
  //   },
  // }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.mode === "light" ? "#000" : "#fff",
  }));

  const buttonStyles = {
    backgroundColor: "#698b8e",
    color: "#fff",
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    textTransform: "none",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#547175",
    },
  };

  const loadAndGroupDemandes = async () => {
    try {
      const response = await demandePRService.getAllDemandePR();
      const filteredDemandes = response.data.filter((demande) => {
        if (!demande.done) {
          if (filtre === "Tous")
            return (
              demande.statutDemande === "Accepter" ||
              demande.statutDemande === "En attente"
            );
          return demande.statutDemande === filtre;
        }
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
      console.log(demandeurId, "000");
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
        minHeight: "83vh", // Pour s'assurer que le fond s'étend sur toute la hauteur de la vue
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
          Liste des Demandes des Pièces de Rechange
        </Typography>
        <Box sx={{ marginBottom: "20px", width: 150 }}>
          <FormControl fullWidth>
            <Select
              labelId="filtre-statut-label"
              size="small"
              id="filtre-statut"
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              displayEmpty // Pour afficher l'élément vide avec le label
            >
              <MenuItem value="Tous">Tous</MenuItem>
              <MenuItem value="Accepter">Acceptées</MenuItem>
              <MenuItem value="En attente">En attente</MenuItem>
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
                width: 662,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontSize: "24px", fontWeight: "bold" }}
                >
                  {nomSociete}
                  <Box
                    sx={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      ({prenomUtilisateur} {nomUtilisateur})
                    </Typography>
                  </Box>
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "light" ? "#bf5037" : "#f7e8dd",
                  }}
                >
                  {firstDemande.statutDemande === "Accepter"
                    ? "Acceptée"
                    : firstDemande.statutDemande === "Annuler"
                    ? "Annulée"
                    : "En attente"}
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ marginBottom: 1 }}
              >
                {eqptDesignation} - {interCode}
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
                    <StyledTableCell>Etat</StyledTableCell>
                    {demandes[interCode].some(
                      (demande) => demande.etat === "Nouveau"
                    ) && (
                      <StyledTableCell>
                        Quantité de pièce de rechange
                      </StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandeGroup.map((articleDemande, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          articleDemande.etat === "Nouveau"
                            ? theme.palette.mode === "light"
                              ? "#fbf6f5"
                              : "#4f5159"
                            : null,
                      }}
                    >
                      <StyledTableCell>
                        {(!articleDemande.autreArt)
                          ? articleDemande.article.nomArticle
                          : articleDemande.autreArt}
                        {articleDemande.autreArt && (
                          <IconButton
                            onClick={() =>
                              window.open(articleDemande.lien, "_blank")
                            }
                            aria-label="Voir l'article"
                          >
                            <LinkIcon />
                          </IconButton>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {articleDemande.quantiteDemande}
                      </StyledTableCell>
                      <StyledTableCell>
                        <span
                          style={{
                            fontWeight:
                              articleDemande.etat === "Nouveau"
                                ? "bold"
                                : "normal",
                            color:
                              articleDemande.etat === "Nouveau"
                                ? theme.palette.mode === "light"
                                  ? "#e02222"
                                  : "#ff6161"
                                : theme.palette.mode === "light"
                                ? "#000"
                                : "#fff",
                          }}
                        >
                          {articleDemande.etat === "Ancien"
                            ? "Ancien"
                            : "Nouveau"}
                        </span>
                      </StyledTableCell>
                      {articleDemande.etat === "Nouveau" && (
                        <StyledTableCell>
                          <TextField
                            value={
                              nouveauxQuantitesPR[
                                articleDemande.codeDemande
                              ] !== undefined
                                ? nouveauxQuantitesPR[
                                    articleDemande.codeDemande
                                  ]
                                : 1
                            }
                            size="small"
                            onChange={(e) =>
                              setNouveauxQuantitesPR((prevQuantites) => ({
                                ...prevQuantites,
                                [articleDemande.codeDemande]: e.target.value,
                              }))
                            }
                            sx={{ width: 80 }}
                            type="Number"
                          />
                        </StyledTableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {firstDemande.statutDemande === "En attente" && (
                <Box sx={{ textAlign: "right", marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    sx={buttonStyles}
                    onClick={() => openDialog(interCode)}
                  >
                    Traiter
                  </Button>
                </Box>
              )}
            </TableContainer>
          );
        })}
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: "20px" }}
          >
            Traitement de la demande
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginBottom: "30px" }}
          ></Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {confirmationMessage === "" ? (
              <>
                <Button
                  onClick={() => {processDemande("Accepter"), closeDialog();}}
                  variant="outlined"
                  color="success"
                  sx={{ borderRadius: "20px", padding: "10px 20px" }}
                >
                  Accepter
                </Button>
                <Button
                  onClick={() => {
                    processDemande("Annuler");
                    closeDialog(); // Appel de closeDialog lorsque vous cliquez sur "Annuler"
                  }}
                  variant="outlined"
                  color="error"
                  sx={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    marginLeft: "10px",
                  }}
                >
                  Annuler
                </Button>
              </>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography style={{ marginBottom: "20px", fontSize: "16px" }}>
                  {confirmationMessage}
                </Typography>
                <Button
                  onClick={closeDialog}
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    textTransform: "none", // Pour empêcher la transformation du texte en majuscules
                  }}
                >
                  OK
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DemandePieceRechange;
