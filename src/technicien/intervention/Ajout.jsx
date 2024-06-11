import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  useTheme,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "react-hook-form";
import { ConfirmationNumberOutlined, Done } from "@mui/icons-material";
import Header from "../components/Header";
import { typeInterService } from "../../services/typeInter_service";
import { useLocation } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import { causeService } from "../../services/cause_service";
import { interventionService } from "../../services/intervention_service";
import { ticketService } from "../../services/ticke_servicet";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { demandePRService } from "../../services/demandePR_service";

const AjoutIntervention = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ticketDataString = searchParams.get("ticketData");
  const ticketData = JSON.parse(ticketDataString);

  const theme = useTheme();
  let navigate = useNavigate();

  const [dateRealisation, setDateRealisaton] = useState(null);
  const [descriptionPanne, setDescriptionPanne] = useState(
    ticketData.intervention.descriptionPanne
  );
  const [dureeRealisation, setDureeRealisation] = useState(0);
  const [compteRendue, setCompteRendue] = useState(
    ticketData.intervention.compteRendu
  );
  const [interObservation, setInterObservaton] = useState(
    ticketData.intervention.interventionObservation
  );
  const [interHebergement, setInterHebergement] = useState(
    ticketData.intervention.interMtHebergement
  );
  const [interDeplacement, setInterDeplacement] = useState(
    ticketData.intervention.interMtDeplacement
  );
  const [dateCloture, setDateCloture] = useState(null);
  const [type, setType] = useState(ticketData.intervention.interventionType);
  const [types, setTypes] = useState([]);
  const [cause, setCause] = useState(ticketData.intervention.cause);
  const [causes, setCauses] = useState([]);

  const loadTypes = async () => {
    try {
      const response = await typeInterService.getAllTypeInter();
      setTypes(response.data);
      console.log("type", response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  
  const [demandes, setDemandes] = useState(null);
  useEffect(() => {
    const fetchDemandePRData = async () => {
      try {
        const response = await demandePRService.getAllDemandePR();
        setDemandes(response.data);
        console.log(response.data,"eee")
      } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
      }
    };

    fetchDemandePRData();
  }, []);

const [d, setD] = useState();
  const loadD = async () => {
    try {
      const response = await demandePRService.getAllDemandePR();
      setD(response.data);
      console.log("demande", response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

 const shouldDisplayButton =
  ticketData.interStatut === "A réaliser" 
  // &&
  // !demandes.some(demande => demande.ticket.intercode === ticketData.interCode);

  const loadCauses = async () => {
    try {
      const response = await causeService.getAllCauses();
      setCauses(response.data);
      console.log("type", response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadTypes();
    loadCauses();
    loadD();
  }, []);

  const [typeError, setTypeError] = useState(false);
  const [causeError, setCauseError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [observationError, setObservationError] = useState(false);
  const [compteRendueError, setCompteRendueError] = useState(false);    

  const handleSaveDialog = () => {
    if (!ticketData.intervention.dateRealisation) {
      setDateRealisaton(new Date());
    }

    const intervention = {
      idIntervention: ticketData.intervention.idIntervention,
      dateCloture: dateCloture,
      descriptionPanne: descriptionPanne,
      dtRealisation: dateRealisation,
      dureeRealisation: dureeRealisation,
      compteRendu: compteRendue,
      interventionObservation: interObservation,
      interMtDeplacement: interDeplacement,
      interMtHebergement: interHebergement,
      interventionType: type,
      cause: cause,
    };

    console.log("avant l'ajout", intervention);

    interventionService
      .updateIntervention(intervention)
      .then(() => {
        if (isInterventionCompleted) {
          ticketService
            .updateTicketStatut(ticketData.interCode, "Réalisé") // Passer le nouvel état comme deuxième argument
            .then((ticketResponse) => {
              console.log(ticketResponse);
              navigate("/technicien/intervention");
              reset(); // Réinitialiser le formulaire
            })
            .catch((error) => {
              console.error("Error fetching ticket data:", error);
            });
        } else {
          navigate("/technicien/intervention");
          reset(); // Réinitialiser le formulaire
        }
      })
      .catch((error) => {
        console.error("Error updating intervention:", error);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const datePrevueString = ticketData.datePrevue ? ticketData.datePrevue : "";
  const datePrevue = new Date(
    datePrevueString.replace("T", " ").replace(/\..+/, "")
  ); // Convertir la chaîne de caractères en objet Date
  const formattedDateT = `${datePrevue
    .getDate()
    .toString()
    .padStart(2, "0")}/${(datePrevue.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${datePrevue.getFullYear()} ${datePrevue
    .getHours()
    .toString()
    .padStart(2, "0")}:${datePrevue.getMinutes().toString().padStart(2, "0")}`;
  console.log(formattedDateT);

  const dateCreationString = ticketData.dateCreation; // Exemple de chaîne de caractères représentant la date
  const dateCreation = new Date(
    dateCreationString.replace("T", " ").replace(/\..+/, "")
  ); // Convertir la chaîne de caractères en objet Date

  const formattedDate = `${dateCreation
    .getDate()
    .toString()
    .padStart(2, "0")}/${(dateCreation.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${dateCreation.getFullYear()}`;
  console.log(formattedDate);

  // Code pour la gestion du chronomètre
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(
    ticketData.intervention.dureeRealisation
  );

  // Ajoutez un nouvel état pour stocker le temps écoulé lorsque le chronomètre est en pause
  const [savedElapsedTime, setSavedElapsedTime] = useState(0);

  const toggleTimer = () => {
    if (isRunning) {
      // Arrêter le chronomètre
      setIsRunning(false);
      // Sauvegarder le temps écoulé dans savedElapsedTime
      setSavedElapsedTime(elapsedTime);
    } else {
      // Démarrer le chronomètre
      setIsRunning(true);
      // Définir le nouveau temps de début comme la date actuelle moins le temps écoulé
      const now = new Date();
      setStartTime(now - elapsedTime);
      // Remplir dateRealisation uniquement si elle est null
      if (!dateRealisation) {
        setDateRealisaton(now);
      }
    }

    // Mise à jour de la durée de réalisation si le chronomètre est arrêté
    if (!isRunning) {
      // Mettre à jour la durée de réalisation avec le temps écoulé
      setDureeRealisation(elapsedTime);
    }
  };

  useEffect(() => {
    // Mise à jour de la durée de réalisation lors de chaque mise à jour de elapsedTime
    if (elapsedTime) {
      setDureeRealisation(elapsedTime);
    }
  }, [elapsedTime]);

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setSavedElapsedTime(0); // Réinitialiser le temps écoulé sauvegardé
    setStartTime(null);
  };

  const [isInterventionCompleted, setIsInterventionCompleted] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleInterventionCompletion = async () => {
    if (
      !type ||
      !cause ||
      !descriptionPanne ||
      !interObservation ||
      !compteRendue
    ) {
      // Définit les états d'erreur pour les champs vides
      setTypeError(!type);
      setCauseError(!cause);
      setDescriptionError(descriptionPanne.trim() === "");
      setObservationError(interObservation.trim() === "");
      setCompteRendueError(compteRendue.trim() === "");
      setSnackbarMessage("Veuillez remplir tous les champs requis.");
      setSnackbarOpen(true);
      return; // Empêche l'exécution de la logique de sauvegarde si des champs sont vides
    }
    // Mettre à jour le statut et la date de clôture seulement si l'intervention n'a pas déjà été marquée comme terminée
    if (!isInterventionCompleted) {
      setDateCloture(new Date());
      setIsInterventionCompleted(true);
    }
  };

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        const now = new Date();
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  const formatElapsedTime = (ms) => {
    // Convertir le temps en secondes
    const totalSeconds = Math.floor(ms / 1000);
    // Calculer le nombre de jours
    const days = Math.floor(totalSeconds / (3600 * 24));
    // Calculer le nombre d'heures restantes après avoir retiré les jours
    const remainingSeconds = totalSeconds % (3600 * 24);
    const hours = Math.floor(remainingSeconds / 3600);
    // Calculer le nombre de minutes restantes après avoir retiré les heures
    const remainingSecondsAfterHours = remainingSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    // Calculer le nombre de secondes restantes après avoir retiré les minutes
    const seconds = remainingSecondsAfterHours % 60;
    // Construire la chaîne de format
    return `${days.toString().padStart(2, "0")}:${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleClick = () => {
    navigate(`/technicien/piece-rechange?ticketId=${ticketData.interCode}`);
  };

  return (
    <>
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
          mb="10px"
          ml="10px"
          sx={{
            fontWeight: 500, // épaisseur de la police
          }}
        >
          Intervention
        </Typography>

        <IconButton
          onClick={handleInterventionCompletion}
          sx={{
            bgcolor: theme.palette.mode === "light" ? "#4caf50" : "#1b5e20", // Vert pour le mode clair et une nuance de vert plus foncé pour le mode sombre
            color: theme.palette.mode === "light" ? "#fff" : "#bdbdbd", // Blanc pour le mode clair et gris clair pour le mode sombre
            "&:hover": {
              bgcolor: theme.palette.mode === "light" ? "#388e3c" : "#015d19", // Vert foncé pour le mode clair et une nuance de vert plus foncé pour le mode sombre au survol
            },
            mr: "10px",
            mb: "10px",
          }}
        >
          <Done />
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
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px", // Ajout de marge en bas pour séparer les deux parties
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
                <ConfirmationNumberOutlined />
                Résoudre Intervention
              </Box>

              {shouldDisplayButton && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClick}
                  sx={{ marginLeft: 80 }}
                  startIcon={<AddShoppingCartIcon />}
                >
                  Demande de Pièces de Rechange
                </Button>
              )}
            </Box>
          }
          subTitle=""
        />
        <Box>
          {/* <Typography
                    variant="h5"
                    sx={{
                      color: isRunning
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {formatElapsedTime(elapsedTime)}
                  </Typography> */}
          <Box display="flex" alignItems="center" ml={2} mb={1}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.mode === "light" ? "#2d323e" : "#b8c9d8",
              }}
            >
              Chronomètre :
            </Typography>
            <IconButton
              onClick={toggleTimer}
              sx={{
                bgcolor:
                  theme.palette.mode === "light"
                    ? "white"
                    : theme.palette.background.main,
                color: isRunning
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.main,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "light" ? "#e8edf2" : "#2d323e",
                },
              }}
            >
              {isRunning ? <StopIcon /> : <PlayArrowIcon />}
            </IconButton>
            {!isRunning && elapsedTime > 0 && (
              <IconButton
                onClick={resetTimer}
                sx={{
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "white"
                      : theme.palette.background.main,
                  color: theme.palette.grey.main,
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "light" ? "#e8edf2" : "#2d323e",
                  },
                  ml: 1,
                }}
              >
                <ReplayIcon />
              </IconButton>
            )}
            <Typography variant="body2" sx={{ marginLeft: 2, fontSize: 17 }}>
              {/* Temps écoulé : {Math.floor(elapsedTime / 1000)} secondes */}
              Temps écoulé : {formatElapsedTime(elapsedTime)}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(handleSaveDialog)}>
          <Grid container spacing={2}>
            {/* Partie gauche */}
            <Grid item xs={12} sm={6} ml={1}>
              <Box
                bgcolor={theme.palette.mode === "light" ? "#f8f8f8" : "#3d3d3d"} // Couleur de fond du cadre
                //borderTop={1} // Bordure supérieure
                //borderBottom={1} // Bordure inférieure
                borderColor="primary.main" // Couleur de la bordure
                p={1} // Espacement intérieur
              >
                <Typography
                  fontWeight="bold"
                  variant="h6"
                  color="primary.main"
                  mb={2}
                >
                  Informations de Ticket
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Code"
                      value={ticketData.interCode}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Désignation"
                      value={ticketData.interDesignation}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Client"
                      value={ticketData.demandeur.client.nomSociete}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Demandeur"
                      value={`${ticketData.demandeur.user.nom} ${ticketData.demandeur.user.prenom}`}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Equipemnet"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={ticketData.equipement.eqptDesignation}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Nature"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={ticketData.interventionNature.libelle}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Priorité"
                      variant="outlined"
                      value={ticketData.interPriorite}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Sous contrat"
                      size="small"
                      variant="outlined"
                      value={ticketData.sousContrat === "O" ? "Oui" : "Non"}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Date Création"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={formattedDate}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      label="Date prévue"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={formattedDateT}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Durée prévue"
                      size="small"
                      variant="outlined"
                      value={ticketData.dureePrevue}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Machine arrêté"
                      size="small"
                      variant="outlined"
                      value={ticketData.machineArret}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  {ticketData.machineArret === "Oui" && (
                    <>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Date d'arrêt"
                          size="small"
                          variant="outlined"
                          value={ticketData.dateArret}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Durée d'arrêt"
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={ticketData.dureeArret}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Description"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={ticketData.description}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid
              item
              sx={{ borderRight: `1px solid ${theme.palette.divider}`, ml: 5 }}
            />

            {/* Partie droite */}
            <Grid item xs={12} sm={5} ml={5}>
              <Typography
                fontWeight="bold"
                variant="h6"
                color="primary.main"
                mb={1}
              >
                Planifier Intervention
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description de panne"
                    size="small"
                    variant="outlined"
                    value={descriptionPanne}
                    onChange={(e) => {
                      setDescriptionPanne(e.target.value);
                      if (e.target.value) setDescriptionError(false);
                    }}
                    error={descriptionError} // Active l'affichage de l'erreur si le champ est vide
                    helperText={
                      descriptionError ? "La description est requise" : ""
                    } // Affiche le message d'erreur si le champ est vide
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={types}
                    value={type}
                    getOptionLabel={(option) => option.libelleType}
                    onChange={(event, value) => {
                      setType(value);
                      // Réinitialiser l'état de l'erreur lorsque vous sélectionnez une valeur
                      setTypeError(false);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type"
                        error={typeError}
                        helperText={typeError ? "Le type est requis" : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={causes}
                    value={cause}
                    getOptionLabel={(option) => option.libelle}
                    onChange={(event, value) => {
                      setCause(value);
                      // Réinitialiser l'état de l'erreur lorsque vous sélectionnez une valeur
                      setCauseError(false);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cause"
                        error={causeError}
                        helperText={causeError ? "La cause est requise" : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Observation"
                    variant="outlined"
                    value={interObservation}
                    onChange={(e) => {
                      setInterObservaton(e.target.value);
                      if (e.target.value) setObservationError(false);
                    }}
                    error={observationError}
                    helperText={
                      observationError ? "l'Observation est requise" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Hebergement"
                    variant="outlined"
                    value={interHebergement}
                    onChange={(e) =>
                      setInterHebergement(parseFloat(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Delplacement"
                    variant="outlined"
                    value={interDeplacement}
                    onChange={(e) =>
                      setInterDeplacement(parseFloat(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Compte rendue"
                    placeholder="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={compteRendue}
                    onChange={(e) => {
                      setCompteRendue(e.target.value);
                      if (e.target.value) setCompteRendueError(false);
                    }}
                    error={compteRendueError}
                    helperText={
                      compteRendueError ? "Compte rendue est requis" : ""
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} mr={1}>
                <Box display="flex" justifyContent="flex-end">
                  {ticketData.interStatut !== "Réalisé" && (
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "light"
                            ? "#3b7e8e"
                            : theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? "#306674"
                              : theme.palette.secondary.main,
                        },
                      }}
                    >
                      Enregistrer
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              sx={{ width: "100%", ml: 7 }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </form>
      </Box>
    </>
  );
};

export default AjoutIntervention;
