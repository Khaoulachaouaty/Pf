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
  Button,
  IconButton,
  Select,
  MenuItem,
  DialogContent,
  Dialog,
  TextField,
  DialogTitle,
  Grid,
} from "@mui/material";
import { demandePRService } from "./../services/demandePR_service";
import { styled } from "@mui/material/styles";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { articleService } from "./../services/article_service";
import { demandeurService } from "./../services/demandeur_service";

const Accueil = () => {
  const theme = useTheme();
  const [demandes, setDemandes] = useState({});
  const [filtre, setFiltre] = useState("Tous");
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [demandeurInfos, setDemandeurInfos] = useState({});

  console.log(demandes,"dddddddddddddddd")
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.mode === "light" ? "#000" : "#fff",
  }));

  const loadAndGroupDemandes = async () => {
    try {
      const response = await demandePRService.getAllDemandePR();
      console.log(response, "aaaaaaaaaa")
      const filteredDemandes = response.data.filter((demande) => {
        // Filtrer selon le filtre sélectionné et le statut "Accepter"
        if (!demande.done) 
        {if (filtre === "Tous") return demande.statutDemande === "Accepter";
        return (
          demande.distingtion === filtre && demande.statutDemande === "Accepter"
        );
      }});
      const groupedDemandes = groupDemandesByInterCode(filteredDemandes);
      console.log(groupedDemandes,"ggggg")
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

  const updateChampDone = async (interCode) => {
    try {
      await demandePRService.updateChampDone(interCode);
      console.log("Champ Done mis à jour pour interCode:", interCode);
      loadAndGroupDemandes();
    } catch (error) {
      console.error("Error updating Done field:", error);
    }
  };

  const updateChampNonDone = async (interCode) => {
    try {
      await demandePRService.updateChapNonDone(interCode);
      console.log("Champ Non-Done mis à jour pour interCode:", interCode);
      loadAndGroupDemandes();
    } catch (error) {
      console.error("Error updating Non-Done field:", error);
    }
  };

  const handleTraiterClick = async (interCode) => {
    try {
      const response = await demandePRService.updateTestQteStock(interCode);
      console.log("updateTestQteStock appelée pour interCode:", interCode);
      console.log("result", response.data);
      loadAndGroupDemandes();
    } catch (error) {
      console.error("Erreur lors de l'appel à updateTestQteStock:", error);
    }
  };

  // const getAllDemandeurInfos = async (demandes) => {
  //   const infos = {};
  //   for (const interCode in demandes) {
  //     const demandeGroup = demandes[interCode];
  //     const firstDemande = demandeGroup[0];
  //     const demandeurId = firstDemande.ticket.demandeur;
  //     console.log(demandeurId, "000");
  //     try {
  //       const response = await demandeurService.getDemandeur(demandeurId);
  //       infos[interCode] = response.data;
  //     } catch (error) {
  //       console.error(
  //         `Error fetching demandeur data for interCode ${interCode}:`,
  //         error
  //       );
  //       infos[interCode] = null;
  //     }
  //   }
  //   return infos;
  // };

  const handleEditClick = (articleId) => {
    setEditId(articleId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewQuantity(0); // Réinitialiser la quantité après la fermeture du dialogue
  };

  const updateArticleQuantity = async () => {
  try {
    // Récupérer les détails de l'article (y compris la quantité actuelle) depuis votre source de données
    const articleDetails = await articleService.getArticle(editId);
    console.log(articleDetails.data)
    const currentQuantity = articleDetails.data.qteArticle;
    
    // Ajouter la nouvelle quantité à la quantité actuelle
    const updatedQuantity = currentQuantity + parseInt(newQuantity, 10);

    
    // Mettre à jour la quantité de l'article avec la nouvelle valeur
    await articleService.updateArticleQte(editId, updatedQuantity);
    
    console.log("Quantité d'article mise à jour pour l'article avec l'ID:", editId);
    handleCloseDialog();
    loadAndGroupDemandes();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité d'article:", error);
  }
};


  return (
    <Box component="main" sx={{
      minHeight: "calc(83vh)",
    }}>
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
          Liste des demandes
        </Typography>
        <Select
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          size="small"
          variant="outlined"
          style={{ marginBottom: 20, width: 250 }}
        >
          <MenuItem value="Tous">Tous</MenuItem>
          <MenuItem value="consommé">Complete</MenuItem>
          <MenuItem value="non consommé">Manque de stock</MenuItem>
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
          const demandeurInfo = demandeurInfos[interCode];
          let prenomUtilisateur = "";
          let nomUtilisateur = ","
          if (demandeurInfo && demandeurInfo.client) {
            nomUtilisateur = demandeurInfo.user.nom;
            prenomUtilisateur = demandeurInfo.user.prenom;
          } else if (typeof firstDemande.ticket.demandeur === "object") {
            nomUtilisateur = firstDemande.ticket.demandeur.user.nom;
            prenomUtilisateur = firstDemande.ticket.demandeur.user.prenom;
          }
          return (
            <TableContainer
              key={interCode}
              component={Paper}
              sx={{
                backgroundColor: demandeGroup.some(
                  (d) => d.distingtion === "non consommé"
                )
                  ? (theme) =>
                      theme.palette.mode === "light" ? "#fff" : "#262626"
                  : (theme) =>
                      theme.palette.mode === "light" ? "#f1ffc7" : "#0e1801",
                padding: "20px",
                borderRadius: "15px",
                width: 660,
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
                  //color="primary"
                  sx={{ fontSize: "24px", fontWeight: "bold" }}
                >
                  {prenomUtilisateur} {nomUtilisateur}
                  <Box
                    sx={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      //color="primary"
                      sx={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      {interCode}
                    </Typography>
                  </Box>
                </Typography>
               
              </Box>
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Article</StyledTableCell>
                    <StyledTableCell>Quantité demandée</StyledTableCell>
                    <StyledTableCell>Quanitité en stock</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandeGroup.map((articleDemande, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>
                        {articleDemande.etat === "Ancien"
                          ? articleDemande.article.nomArticle
                          : articleDemande.autreArt}
                      </StyledTableCell>
                      <StyledTableCell style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight:
                              articleDemande.quantiteDemande >
                              (articleDemande.article
                                ? articleDemande.article.qteArticle
                                : 0)
                                ? "bold"
                                : "normal",
                            color:
                              articleDemande.quantiteDemande >
                              (articleDemande.article
                                ? articleDemande.article.qteArticle
                                : 0)
                                ? theme.palette.mode === "dark"
                                  ? "#ff5252"
                                  : "red"
                                : "inherit",
                          }}
                        >
                          {articleDemande.quantiteDemande}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell style={{ textAlign: 'center' }}>
                        {articleDemande.article
                          ? articleDemande.article.qteArticle
                          : "-"}
                      </StyledTableCell>

                      <StyledTableCell>
                        <IconButton
                          onClick={() =>
                            handleEditClick(articleDemande.article.codeArticle)
                          }
                          color="warning"
                        >
                          <EditIcon />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                {/* Affiche le bouton "Traiter" pour les distinctions "new" ou "non consommé" */}
                {["new", "non consommé"].includes(
                  demandeGroup[0].distingtion
                ) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTraiterClick(interCode)}
                  >
                    Traiter
                  </Button>
                )}
                {/* Affiche les boutons d'icône uniquement si la distinction est "consommé" */}
                {demandeGroup.every((d) => d.distingtion === "consommé") && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      ml: 68,
                    }}
                  >
                    <IconButton onClick={() => updateChampDone(interCode)}>
                      <DoneIcon
                        sx={{
                          color:
                            theme.palette.mode === "light"
                              ? "#007400"
                              : "#9dff89",
                        }}
                      />
                    </IconButton>
                    <IconButton onClick={() => updateChampNonDone(interCode)}>
                      <CloseIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </TableContainer>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "32vh",
        }}
      ></Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter au stock</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
        <Grid item xs={12} my={1}>
          <TextField
            autoFocus
            margin="dense"
            label="Nouvelle quantité"
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            fullWidth
          />
          </Grid>
          <Grid
                    item
                    xs={12}
                    container
                    justifyContent="flex-end"
                    spacing={2}
                  >
                    <Grid item>
                      <Button
                      onClick={handleCloseDialog}
                        variant="outlined"
                        color="secondary"
                      >
                        Annuler
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button onClick={updateArticleQuantity} type="submit" variant="contained" color="primary">
                        Valider
                      </Button>
                    </Grid>
                    </Grid>
          </Grid>
         
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Accueil;
