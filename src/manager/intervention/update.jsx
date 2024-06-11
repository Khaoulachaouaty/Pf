import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  useTheme,
  Stack,
  Box,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useForm } from "react-hook-form";
import { ticketService } from "../../services/ticke_servicet";
import { DateTimePicker } from "@mui/x-date-pickers";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import Header from "../../admin/components/Header";
import { technicienService } from "../../services/technicien_service";
import { departementService } from "../../services/departement_service";
import { useLocation, useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import { imageService } from "../../services/image_service";
const UpdateIntervention = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ticketDataString = searchParams.get("ticketData");
  const ticketData = JSON.parse(ticketDataString);

  const theme = useTheme();

  // Assuming this code is within a functional component
  const [datePrevue, setDatePrevue] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    let formattedDatePrevue = null;
    if (ticketData.datePrevue) {
      formattedDatePrevue = new Date(
        ticketData.datePrevue.replace(" 00:00", "")
      );
    }
    setDatePrevue(formattedDatePrevue);
  }, [ticketData.datePrevue]);

  const [dureePrevue, setDureePrevue] = useState(datePrevue);
  const [statut, setStatut] = useState(ticketData?.interStatut ?? "");
  const [departement, setDepartement] = useState(
    ticketData?.technicien?.departement ?? null
  );
  const [technicien, setTechnicien] = useState(
    ticketData?.technicien.user ?? null
  );
  const [techniciens, setTechniciens] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [depTech, setDepTech] = useState([]);

  const loadDepartements = async () => {
    try {
      const response = await departementService.getAllDepartements();
      setDepartements(response.data);
      console.log("dep", response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  const loadTechniciens = async () => {
    try {
      const response = await technicienService.getTechniciens();
      const techniciensWithImages = await Promise.all(
        response.data.map(async (technicien) => {
          let avatarUrl = "";
          try {
            const imageResponse = await imageService.getImage(
              technicien.imageId
            );
            avatarUrl = `data:image/png;base64,${imageResponse.data.image}`;
          } catch (error) {
            console.error("Error fetching image:", error);
          }
          return {
            ...technicien,
            avatarUrl,
          };
        })
      );
      setTechniciens(techniciensWithImages);
      console.log(techniciensWithImages, "2222");
    } catch (error) {
      console.error("Error fetching technicians data:", error);
    }
  };

  const loadTechDep = async (departement) => {
    try {
      const response = await technicienService.getTechByDep(departement);
      const techniciensWithImages = await Promise.all(
        response.data.map(async (technicien) => {
          let avatarUrl = "";
          try {
            const imageResponse = await imageService.getImage(
              technicien.user.image.idImage
            );
            console.log(imageResponse.data, "immmmmmm");
            avatarUrl = `data:image/png;base64,${imageResponse.data.image}`;
          } catch (error) {
            console.error("Error fetching image:", error);
          }
          return {
            ...technicien.user,
            avatarUrl,
          };
        })
      );
      setDepTech(techniciensWithImages);
      console.log(response.data, "888888888888");
    } catch (error) {
      console.error("Error fetching technicians data:", error);
    }
  };

  useEffect(() => {
    loadDepartements();
    loadTechniciens();
  }, []);

  useEffect(() => {
    if (departement) {
      loadTechDep(departement.codeDepart);
    }
  }, [departement]);

  const status = ["A réaliser", "Bloqué", "Annulé"];

  const handleSaveDialog = () => {
    let validationErrors = {};

    // Check if statut is "A réaliser" and required fields are not filled
    if (statut === "A réaliser") {
      if (!datePrevue) {
        validationErrors.datePrevue = "Date prévue est obligatoire";
      }
      if (!technicien) {
        validationErrors.technicien = "Technicien est obligatoire";
      }
    }

    // If there are validation errors, update the state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const ticket = {
      intervention: {
        idIntervention: ticketData.intervention.idIntervention,
      },
      datePrevue: datePrevue,
      dureePrevue: dureePrevue,
      description: ticketData.description,
      dureeArret: ticketData.dureeArret,
      equipement: ticketData.equipement,
      dateCreation: dateCreation,
      interDesignation: ticketData.interDesignation,
      interPriorite: ticketData.interPriorite,
      interStatut: statut,
      interventionNature: ticketData.interventionNature,
      machineArret: ticketData.machineArret,
      sousContrat: ticketData.sousContrat,
      sousGarantie: ticketData.sousGarantie,
      dateArret: ticketData.dateArret,
      demandeur: {
        codeDemandeur: ticketData.demandeur.codeDemandeur,
      },
      technicien: {
        codeTechnicien: technicien.codeTechnicien,
      },
      interCode: ticketData.interCode,
    };
    console.log("avant l'ajout", ticket),
      ticketService
        .updateTicket(ticket)
        .then((response) => {
          console.log("ticket added successfully:", response.data);
          reset();
          navigate("/manager/intervention");
        })
        .catch((error) => {
          console.error(error);
        });
  };
  const [errors, setErrors] = useState({});

  const {
    register,
    handleSubmit,
    //formState: { errors },
    reset,
  } = useForm();

  const dateString = ticketData.dateCreation;
  const formattedDateString = dateString.replace(" 00:00", ""); // Supprimer la partie de fuseau horaire incorrecte
  const dateCreation = new Date(formattedDateString); // Convertir la chaîne de caractères en objet Date

  const currentDate = useState(new Date());

  const formattedDate = `${dateCreation
    .getDate()
    .toString()
    .padStart(2, "0")}/${(dateCreation.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${dateCreation.getFullYear()}`;
  console.log(formattedDate);

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
        //alignItems="center"
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
                gap: "8px",
                fontSize: "20px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
              }}
            >
              <ConfirmationNumberOutlined />
              Nouveau Intervention
            </Box>
          }
          subTitle=""
        />
        <form onSubmit={handleSubmit(handleSaveDialog)}>
          <Grid container spacing={2}>
            {/* Partie gauche */}
            <Grid item xs={12} sm={5} ml={1} mr={5}>
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
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Date d'arrêt"
                          size="small"
                          variant="outlined"
                          value={ticketData.dtRealisation}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
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
              sx={{ borderRight: `1px solid ${theme.palette.divider}` }}
            />

            {/* Partie droite superieur*/}
            <Grid item xs={12} sm={6} ml={5}>
              <Box p={1}>
                <Typography
                  fontWeight="bold"
                  variant="h6"
                  color="primary.main"
                  mb={2}
                >
                  A remplir
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-technicien"
                      size="small"
                      options={departement ? depTech : techniciens}
                      getOptionLabel={(option) =>
                        `${option.prenom} ${option.nom}`
                      }
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Avatar
                            src={option.avatarUrl}
                            alt={`${option.prenom} ${option.nom}`}
                            sx={{ width: 31, height: 31, marginRight: 1 }}
                          />
                          {option.nom} {option.prenom}
                        </li>
                      )}
                      value={technicien}
                      onChange={(event, value) => {
                        console.log("tech", value);
                        setTechnicien(value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Technicien"
                          error={!!errors.technicien}
                          helperText={errors.technicien}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-departement"
                      size="small"
                      options={departements}
                      value={departement}
                      getOptionLabel={(option) => option.nomDepart}
                      onChange={(event, value) => {
                        console.log(value);
                        setDepartement(value);
                        if (value) {
                          loadTechDep(value.codeDepart); // Chargez les techniciens pour le département sélectionné
                        } else {
                          setDepTech([]); // Réinitialisez les techniciens si aucun département n'est sélectionné
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Département" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={status}
                      size="small"
                      value={statut}
                      sx={{ width: "100%" }}
                      onChange={(event, value) => {
                        setStatut(value);
                        console.log(value);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Statut" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      type="number"
                      value={dureePrevue}
                      label="Durée prévue"
                      onChange={(e) =>
                        setDureePrevue(parseFloat(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={2} sx={{ minWidth: 305 }}>
                        <DateTimePicker
                          value={datePrevue}
                          label="Date prevue"
                          onChange={(date) => setDatePrevue(date)}
                          minDateTime={currentDate[0]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.datePrevue}
                              helperText={errors.datePrevue}
                            />
                          )}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {/* Partie droite inferieur*/}
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
                  mb={1}
                >
                  Planifier Intervention
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Description de panne"
                      size="small"
                      variant="outlined"
                      value={ticketData.intervention.descriptionPanne}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Observation"
                      variant="outlined"
                      value={ticketData.intervention.interventionObservation}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Type"
                      size="small"
                      variant="outlined"
                      value={
                        ticketData.intervention.interventionType
                          ? ticketData.intervention.interventionType.libelleType
                            ? ticketData.intervention.interventionType
                                .libelleType
                            : ""
                          : ""
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Cause"
                      size="small"
                      variant="outlined"
                      value={
                        ticketData.intervention.cause
                          ? ticketData.intervention.cause.libelle
                            ? ticketData.intervention.cause.libelle
                            : ""
                          : ""
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Date réalisation"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={ticketData.dtRealisation}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Durée réalisation"
                      size="small"
                      variant="outlined"
                      value={ticketData.dureeRealisation}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Delplacement"
                      variant="outlined"
                      value={ticketData.intervention.interMtDeplacement}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Hebergement"
                      variant="outlined"
                      value={ticketData.intervention.interMtHebergement}
                      InputProps={{
                        readOnly: true,
                      }}
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
                      value={ticketData.intervention.compteRendu}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid container>
              <Grid item xs={12} mr={1}>
                <Box display="flex" justifyContent="flex-end">
                {!["Réalisé", "Annulé", "À réaliser"].includes(ticketData.interStatut) && (
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
        </form>
      </Box>
    </>
  );
};

export default UpdateIntervention;
