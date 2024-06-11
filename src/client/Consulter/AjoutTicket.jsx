import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  useTheme,
  FormControlLabel,
  Box,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  Autocomplete,
  Stack,
  Avatar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ticketService } from "../../services/ticke_servicet";
import { adminService } from "../../services/equipement_service";
import { technicienService } from "../../services/technicien_service";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { userService } from "../../services/user_service";
import { imageService } from "../../services/image_service"; // Import the image service

const AddTicketForm = () => {
  const theme = useTheme();
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [sousGarantie, setSousGarantie] = useState("N");
  const [sousContrat, setSousContrat] = useState("N");
  const [priorite, setPriorite] = useState("");
  const [machineArret, setMachineArret] = useState("Non");
  const [dureeArret, setDureeArret] = useState(0);
  const [dateArret, setDateArret] = useState(null);
  const [equipement, setEquipement] = useState(null);
  const [nature, setNature] = useState(null);
  const [technicien, setTechnicien] = useState(null);

  const [eq, setEq] = useState([]);
  const [nat, setNat] = useState([]);
  const [techniciens, setTechniciens] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [designationError, setDesignationError] = useState(false);
  const [equipementError, setEquipementError] = useState(false);
  const [natureError, setNatureError] = useState(false);
  const [prioriteError, setPrioriteError] = useState(false);

  const [profile, setProfile] = useState([]);

  let navigate = useNavigate();

  const loadNature = async () => {
    try {
      const response = await ticketService.getAllNature();
      setNat(response.data);
    } catch (error) {
      console.error("Error fetching nature data:", error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const loadEquipement = async (codeClient) => {
    try {
      const response = await adminService.getAllEquipementsByClient(codeClient);
      setEq(response.data);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  const loadTechniciens = async () => {
    try {
      const response = await technicienService.getTechniciens();
      const techniciensWithImages = await Promise.all(
        response.data.map(async (technicien) => {
          let avatarUrl = "";
          try {
            const imageResponse = await imageService.getImage(technicien.imageId);
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
      console.log(techniciensWithImages);
    } catch (error) {
      console.error("Error fetching technicians data:", error);
    }
  };

  useEffect(() => {
    loadProfile();
    loadTechniciens();
    loadNature();
  }, []);

  useEffect(() => {
    if (profile.codeClient) {
      loadEquipement(profile.codeClient);
    }
  }, [profile]);

  const prio = ["Haute", "Moyenne", "Faible"];

  const handleSaveDialog = () => {
    // Reset errors
    setDesignationError(false);
    setEquipementError(false);
    setNatureError(false);
    setPrioriteError(false);

    // Check for empty required fields
    let hasError = false;
    if (!designation) {
      setDesignationError(true);
      hasError = true;
    }

    if (!equipement) {
      setEquipementError(true);
      hasError = true;
    }

    if (!nature) {
      setNatureError(true);
      hasError = true;
    }

    if (!priorite) {
      setPrioriteError(true);
      hasError = true;
    }

    if (hasError) {
      setSnackbarMessage("Les champs obligatoires sont manquants");
      setSnackbarOpen(true);
      return;
    }

    const ticket = {
      dateArret: dateArret,
      description: description,
      dureeArret: dureeArret,
      equipement: equipement,
      dateCreation: new Date(),
      interDesignation: designation,
      interPriorite: priorite,
      interStatut: "En attente",
      interventionNature: nature,
      machineArret: machineArret,
      sousContrat: sousContrat,
      sousGarantie: sousGarantie,
      technicien: technicien
       
    };

    ticketService
      .addTicket(ticket)
      .then(() => {
        navigate("/client/consulter_tickets");
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCancel = () => {
    navigate("/client/consulter_tickets");
  };

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(handleSaveDialog)}
        sx={{
          maxWidth: 800,
          margin: "auto",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" color="secondary" mb={2}>
              <ConfirmationNumberOutlined /> Nouveau Ticket
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Désignation"
              variant="outlined"
              size="small"
              value={designation}
              onChange={(e) => {
                setDesignation(e.target.value);
                if (e.target.value) setDesignationError(false);
              }}
              error={designationError}
              helperText={designationError && "La désignation est requise"}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={nat}
              size="small"
              getOptionLabel={(option) => option.libelle}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nature"
                  variant="outlined"
                  error={natureError}
                  helperText={natureError && "La nature est requise"}
                />
              )}
              onChange={(event, value) => {
                setNature(value);
                if (value) setNatureError(false);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={eq}
              size="small"
              getOptionLabel={(option) => option.eqptDesignation}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Equipement"
                  variant="outlined"
                  error={equipementError}
                  helperText={equipementError && "L'équipement est requis"}
                />
              )}
              onChange={(event, value) => {
                setEquipement(value);
                if (value) setEquipementError(false);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={prio}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Priorité"
                  variant="outlined"
                  error={prioriteError}
                  helperText={prioriteError && "La priorité est requise"}
                />
              )}
              onChange={(event, value) => {setPriorite(value);
                if (value) setPrioriteError(false);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={techniciens}
              size="small"
              getOptionLabel={(option) =>
                `${option.prenom} ${option.nom}`
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Avatar
                    src={option.avatarUrl}
                    alt={`${option.nom} ${option.prenom}`}
                    sx={{ width: 31, height: 31, marginRight: 1 }}
                  />
                  {option.nom} {option.prenom}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Technicien" variant="outlined" />
              )}
              onChange={(event, value) => setTechnicien(value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              size="small"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sousContrat === "O"}
                  onChange={(e) => setSousContrat(e.target.checked ? "O" : "N")}
                />
              }
              label="Sous Contrat"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sousGarantie === "O"}
                  onChange={(e) =>
                    setSousGarantie(e.target.checked ? "O" : "N")
                  }
                />
              }
              label="Sous Garantie"
            />
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={machineArret === "Oui"}
                  onChange={(e) =>
                    setMachineArret(e.target.checked ? "Oui" : "Non")
                  }
                />
              }
              label="Machine à l'arrêt"
            />
          </Grid>
          {machineArret === "Oui" && (
            <>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns} >
                  <DateTimePicker
                    label="Date de l'arrêt"
                    value={dateArret}
                    onChange={setDateArret}
                    renderInput={(params) => (
                      <TextField  {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Durée de l'arrêt (en heures)"
                  variant="outlined"
                  type="number"
                  value={dureeArret}
                  onChange={(e) => setDureeArret(e.target.value)}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} display="flex" justifyContent="flex-end" spacing={2}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" type="submit">
                Ajouter
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Annuler
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddTicketForm;
