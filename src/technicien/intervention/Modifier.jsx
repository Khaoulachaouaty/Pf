import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  useTheme,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "react-hook-form";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import Header from "../../admin/components/Header";
import { typeInterService } from "../../services/typeInter_service";
import { useLocation } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { causeService } from "../../services/cause_service";
import { interventionService } from "../../services/intervention_service";
import { ticketService } from "../../services/ticke_servicet";
import { useNavigate } from "react-router-dom";

const ModifierIntervention = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ticketDataString = searchParams.get("ticketData");
  const interventionString = searchParams.get("intervention");
  const ticketData = JSON.parse(ticketDataString);
  const intervention = JSON.parse(interventionString);

  const theme = useTheme();
  let navigate = useNavigate();

  console.log("tickettttttt", ticketData);
  console.log("iner", intervention);

  const [descriptionPanne, setDescriptionPanne] = useState(intervention.descriptionPanne);
  const [dureeRealisation, setDureeRealisation] = useState(0);
  const [compteRendue, setCompteRendue] = useState(intervention.compteRendu);
  const [cause, setCause] = useState(intervention.cause);
  const [interObservation, setInterObservaton] = useState(intervention.interventionObservation);
  const [interHebergement, setInterHebergement] = useState(intervention.interMtHebergement);
  const [interDeplacement, setInterDeplacement] = useState(intervention.interMtDeplacement);
  const [dateCloture, setDateCloture] = useState(null);
  const [type, setType] = useState(intervention.interventionType);
  const [types, setTypes] = useState([]);
  const [statut, setStatut] = useState(ticketData.interStatut);
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
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleUpdate = () => {
    const intervention = {
      dateCloture: dateCloture,
      descriptionPanne: descriptionPanne,
      dureeRealisation: dureeRealisation,
      dateRealisation: interventionService.dateRealisation,
      compteRendu: compteRendue,
      interventionObservation: interObservation,
      interMtDeplacement: interDeplacement,
      interMtHebergement: interHebergement,
      ticket: {
        interCode: ticketData.interCode,
      },
      interventionType: type,
      cause: cause,
    };
  
    // Appel du service pour mettre à jour l'intervention
    interventionService
      .updateIntervention(intervention)
      .then((response) => {
        console.log("Intervention mise à jour avec succès :", response);
        // Effectuer d'autres actions si nécessaire après la mise à jour
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'intervention :", error);
      });
  };

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastStopTime, setLastStopTime] = useState(0);
  const [savedTime, setSavedTime] = useState(0);

  const toggleTimer = () => {
    if (isRunning) {
      // Arrêter le chronomètre
      setIsRunning(false);
      // Sauvegarder le temps écoulé dans dureeRealisation
      setDureeRealisation(Math.floor(elapsedTime / 1000));
    } else {
      // Démarrer le chronomètre
      setIsRunning(true);
      // Définir le nouveau temps de début en soustrayant le temps sauvegardé
      // du temps actuel
      setStartTime(new Date() - savedTime);
    }
  };

  const formatElapsedTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const datePrevueString = ticketData.datePrevue;
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
    .padStart(2, "0")}/${(datePrevue.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${datePrevue.getFullYear()}`;
  console.log(formattedDate);

  const [isInterventionCompleted, setIsInterventionCompleted] = useState(false);

  const handleInterventionCompletion = async () => {
    // Mettre à jour le statut et la date de clôture seulement si l'intervention n'a pas déjà été marquée comme terminée
    if (!isInterventionCompleted) {
      setStatut("Réalisé");
      setDateCloture(new Date());
      setIsInterventionCompleted(true);
    }
  };

  return (
    <>
      <Typography
        color="#aebfcb"
        fontSize="30px"
        margin="10px"
        sx={{
          fontWeight: 500, // épaisseur de la police
        }}
      >
        Gérer Ticket
      </Typography>
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
                Nouveau Intervention
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: isRunning
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    transition: "color 0.3s ease",
                  }}
                >
                  {formatElapsedTime(elapsedTime)}
                </Typography>
                <Box>
                  <IconButton
                    onClick={toggleTimer}
                    sx={{
                      bgcolor: "white",
                      color: isRunning
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      "&:hover": {
                        bgcolor: "white",
                      },
                    }}
                  >
                    {isRunning ? <StopIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  {!isRunning && elapsedTime > 0 && (
                    <IconButton
                      onClick={resetTimer}
                      sx={{
                        bgcolor: "white",
                        color: theme.palette.warning.main,
                        "&:hover": {
                          bgcolor: "white",
                        },
                        ml: 1,
                      }}
                    >
                      <ReplayIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          }
          subTitle=""
        />
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Grid container spacing={2}>
            {/* Partie gauche */}
            <Grid item xs={12} sm={5} mr={9}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Désignation
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={ticketData.interDesignation}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Client
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={ticketData.demandeur.client.nomSociete}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Demandeur
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={`${ticketData.demandeur.user.nom} ${ticketData.demandeur.user.prenom}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Nature
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={ticketData.interventionNature.libelle}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Equipement
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={ticketData.equipement.eqptDesignation}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Priorité
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={ticketData.interPriorite}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Date de création
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formattedDate}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Date prévue
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formattedDateT}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Durée prévue
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={ticketData.dureePrevue}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography fontWeight="bold" variant="subtitle1">
                      Arrêt
                    </Typography>
                    <TextField
                      fullWidth
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
                      <Grid item xs={6}>
                        <Typography fontWeight="bold" variant="subtitle1">
                          Date d'arrêt
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={ticketData.dateArret}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight="bold" variant="subtitle1">
                          Durée d'arrêt
                        </Typography>
                        <TextField
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
                </Grid>
                <Grid item xs={12}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
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
            </Grid>
            {/* Partie droite */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Type
                  </Typography>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={types}
                    value={type}
                    getOptionLabel={(option) => option.libelleType}
                    sx={{ width: "100%" }}
                    onChange={(event, value) => {
                      setType(value);
                      console.log("typeeeeeeeeeeeee", value);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Sélectionner type" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Description de panne
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={descriptionPanne}
                    onChange={(e) => setDescriptionPanne(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Cause
                  </Typography>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={causes}
                    value={cause}
                    getOptionLabel={(option) => option.libelle}
                    sx={{ width: "100%" }}
                    onChange={(event, value) => {
                      setCause(value);
                      console.log(value);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Sélectionner cause" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Compte rendue
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={compteRendue}
                    onChange={(e) => setCompteRendue(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Observation
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={interObservation}
                    onChange={(e) => setInterObservaton(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Hebrgement
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={interHebergement}
                    onChange={(e) =>
                      setInterHebergement(parseFloat(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" variant="subtitle1">
                    Deplacement
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={interDeplacement}
                    onChange={(e) =>
                      setInterDeplacement(parseFloat(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.primary.main
                        : theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? theme.palette.secondary.main
                          : theme.palette.secondary.main,
                    },
                  }}
                >
                  Ajouter
                </Button>
                <Button
                  variant="contained"
                  onClick={handleInterventionCompletion}
                  sx={{
                    backgroundColor: "#4caf50", // Vert
                    color: "#ffffff", // Blanc
                    "&:hover": {
                      backgroundColor: "#388e3c", // Vert foncé au survol
                    },
                  }}
                  startIcon={<CheckCircleIcon />} // Icône de coche verte
                >
                  Marquer comme terminée
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default ModifierIntervention;
