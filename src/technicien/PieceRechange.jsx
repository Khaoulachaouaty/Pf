import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
  useTheme,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../admin/components/Header";
import { pieceRechangeService } from "./../services/pieceRechange_service";
import { useLocation, useNavigate } from "react-router-dom";
import { ticketService } from "./../services/ticke_servicet"; // Correction du nom d'import
import { demandePRService } from "./../services/demandePR_service"; // Correction du nom d'import
import { articleService } from "./../services/article_service";

const DemandePieceForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ticketId = searchParams.get("ticketId");

  let navigate = useNavigate();

  const [demande, setDemande] = useState([{ nomArticle: "", qteUE: "" }]);
  const [piecesManuelles, setPiecesManuelles] = useState([]);
  const theme = useTheme();
  const [pieces, setPieces] = useState([]);
  const [ticket, setTicket] = useState({});
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(-1);
  const [equipments, setEquipments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [articlesComplet, setArticlesComplet] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger d'abord le ticket pour obtenir son équipement
        const ticketResponse = await ticketService.getTicket(ticketId);
        const ticketData = ticketResponse.data;
        setTicket(ticketData);
        const equipment = ticketData.equipement;

        // Charger les pièces et les articles simultanément
        const [piecesResponse, articlesResponse] = await Promise.all([
          pieceRechangeService.getAllPieceRechange(),
          articleService.getAllArticles(),
        ]);
        console.log(piecesResponse.data,"************")
        const piecesData = piecesResponse.data;
        const articlesData = articlesResponse.data;

        // Filtrer les pièces en fonction de l'équipement du ticket
        const filteredPieces = piecesData.filter(
          (piece) => piece.id.eqptCode === equipment.eqptCode
        );
        setPieces(filteredPieces);

        // Filtrer les articles pour exclure ceux qui sont déjà présents dans les pièces
        const filteredArticles = articlesData.filter(
          (article) =>
            !filteredPieces.some(
              (piece) => piece.article.codeArticle === article.codeArticle
            )
        );
        setArticles(filteredArticles);

        // Mettre à jour les équipements avec l'équipement du ticket
        setEquipments([equipment]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log(pieces,"pp"),
    console.log(articles,"arr")

    loadData();
    loadArticlesComplet();
  }, [ticketId]);

  const loadArticlesComplet = async () => {
    try {
      const response = await articleService.getAllArticles();
      setArticlesComplet(response.data);
    } catch (error) {
      console.error("Error fetching articles data:", error);
    }
  };

  const handleQteUEChange = (index, value) => {
    const newDemande = [...demande];
    newDemande[index].qteUE = value;
    setDemande(newDemande);
    setSelectedPieceIndex(index);
  };
 console.log(demande,"ddd")
 console.log(piecesManuelles,"pll")


  const handleChangeNomArticle = (index, value) => {
    setPiecesManuelles((prev) => {
      const newArr = [...prev];
      newArr[index].nomArticle = value;
      return newArr;
    });
  };

  const handleChangeQteUE = (index, value) => {
    setPiecesManuelles((prev) => {
      const newArr = [...prev];
      newArr[index].qteUE = value;
      return newArr;
    });
  };

  const handleChangeLink = (index, value) => {
    setPiecesManuelles((prev) => {
      const newArr = [...prev];
      newArr[index].link = value;
      return newArr;
    });
  };

  const addDemande = () => {
    setDemande((prevDemande) => [
      ...prevDemande,
      { nomArticle: "", qteUE: "" },
    ]);
  };

  const addPieceManuelle = () => {
    setPiecesManuelles((prevPiecesManuelles) => [
      ...prevPiecesManuelles,
      { nomArticle: "", qteUE: "", link: "" },
    ]);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateAndSaveData = async () => {
    const allData = [...demande, ...piecesManuelles];
    const uniqueArticles = new Set();

    const hasFilledFields = allData.some(
      (item) => item.nomArticle || item.qteUE
    );
    if (!hasFilledFields) {
      setSnackbar({
        open: true,
        message: "Veuillez remplir au moins un champ dans la demande.",
        severity: "error",
      });
      return false;
    }

    for (const item of allData) {
      if (!item.nomArticle && !item.qteUE) {
        continue;
      }

      if (!item.nomArticle || !item.qteUE) {
        setSnackbar({
          open: true,
          message: "Tous les champs doivent être remplis.",
          severity: "error",
        });
        return false;
      }

      if (uniqueArticles.has(item.nomArticle)) {
        setSnackbar({
          open: true,
          message:
            "L'article ne peut pas être sélectionné ou écrit plusieurs fois.",
          severity: "error",
        });
        return false;
      }

      uniqueArticles.add(item.nomArticle);

      const piece = pieces.find(
        (p) => p.article.nomArticle === item.nomArticle
      );
      if (piece && parseInt(item.qteUE) > parseInt(piece.eqprQte)) {
        setSnackbar({
          open: true,
          message: "La quantité saisie dépasse la quantité accecible.",
          severity: "error",
        });
        return false;
      }
    }

    const dataToSave = allData
      .filter((item) => item.nomArticle || item.qteUE)
      .map((item) => {
        let art, autreArt;
        const articleExist = articlesComplet.find(
          (article) => article.nomArticle === item.nomArticle
        );
        if (articleExist) {
          art = articleExist;
          autreArt = null;
        } else {
          art = null;
          autreArt = item.nomArticle;
        }

        return {
          article: art,
          autreArt: autreArt,
          quantiteDemande: parseInt(item.qteUE),
          statutDemande: "En attente",
          etat: piecesManuelles.some(
            (piece) => piece.nomArticle === item.nomArticle
          )
            ? "Nouveau"
            : "Ancien", // Déterminer l'état en fonction de la provenance de l'article
          lien: item.link || "", // Ajouter le lien
          ticket: {
            interCode: ticketId,
          },
        };
      });

    try {
      const response = await demandePRService.addDemandePR(dataToSave);
      navigate(-1);

      setSnackbar({
        open: true,
        message: "Demande enregistrée avec succès.",
        severity: "success",
      });
      setDemande([{ nomArticle: "", qteUE: "" }]);
      setPiecesManuelles([]);
      console.log("Réponse de l'enregistrement:", response.data);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la demande:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'enregistrement de la demande.",
        severity: "error",
      });
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await validateAndSaveData();
  };

  return (
    <div
      style={{
        backgroundColor: theme.palette.mode === "light" ? "#f6f6f6" : "#0f0f0f",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="10px"
          sx={{
            fontWeight: 500,
          }}
        >
          Piece de rechange
        </Typography>
        <IconButton onClick={addDemande} sx={{ backgroundColor: "#e1ecec", mr:3 }}>
          <AddIcon sx={{ fontSize: "38px" }} />
        </IconButton>
      </Box>
      <Box
        display="flex"
        p={2}
        flexDirection="column"
        justifyContent="center"
        margin="auto"
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "50px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
        <Header
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                Demande de pieces de rechange
              </Box>
            </Box>
          }
          subTitle={ticketId}
        />

        <form onSubmit={handleSubmit}>
          {demande.map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ marginBottom: "10px" }}
            >
              <Grid item xs={6}>
                <Autocomplete
                  options={pieces}
                  getOptionLabel={(option) => option.article.nomArticle}
                  onChange={(event, value) => {
                    setSelectedPieceIndex(index);
                    setDemande((prevDemande) => {
                      const newDemande = [...prevDemande];
                      newDemande[index].nomArticle = value
                        ? value.article.nomArticle
                        : "";
                      return newDemande;
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sélectionner pièce de rechange"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantité"
                  value={item.qteUE}
                  onChange={(e) => handleQteUEChange(index, e.target.value)}
                  type="number"
                  fullWidth
                  error={
                    demande[index].nomArticle &&
                    parseInt(item.qteUE) >
                      parseInt(
                        pieces.find(
                          (p) =>
                            p.article.nomArticle === demande[index].nomArticle
                        )?.eqprQte || 0
                      )
                  }
                  helperText={
                    demande[index].nomArticle &&
                    parseInt(item.qteUE) >
                      parseInt(
                        pieces.find(
                          (p) =>
                            p.article.nomArticle === demande[index].nomArticle
                        )?.eqprQte || 0
                      )
                      ? "La quantité saisie dépasse la quantité accecible."
                      : ""
                  }
                />
              </Grid>
            </Grid>
          ))}

          {piecesManuelles.map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ marginBottom: "10px" }}
            >
              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  options={articles.map((article) => article.nomArticle)}
                  value={item.nomArticle}
                  onChange={(event, value) =>
                    handleChangeNomArticle(index, value)
                  }
                  onInputChange={(event, value) =>
                    handleChangeNomArticle(index, value)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Article"
                      fullWidth
                      variant={
                        selectedPieceIndex === index ? "outlined" : "standard"
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantité"
                  value={item.qteUE}
                  onChange={(e) => handleChangeQteUE(index, e.target.value)}
                  type="number"
                  fullWidth
                  variant={
                    selectedPieceIndex === index ? "outlined" : "standard"
                  }
                />
              </Grid>
              {item.nomArticle &&
                !articles.some(
                  (article) => article.nomArticle === item.nomArticle
                ) && (
                  <Grid item xs={10}>
                    <TextField
                      label="Lien de l'article"
                      value={item.link}
                      onChange={(e) => handleChangeLink(index, e.target.value)}
                      fullWidth
                    />
                  </Grid>
                )}
            </Grid>
          ))}
          <Button
            onClick={addPieceManuelle}
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
          >
            Nouvelle pièce de rechange
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", marginLeft: "49%" }}
          >
            Envoyer la demande
          </Button>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DemandePieceForm;
