import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
  FormControlLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user_service";
import { PersonAddAltOutlined } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import frLocale from "date-fns/locale/fr";
import { clientService } from "../../services/client_service";

const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AjoutEquipe = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState([]);

  const loadClient = async () => {
    try {
      const res = await clientService.getAllClients();
      setClient(res.data);
      console.log(res);
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  useEffect(() => {
    loadClient();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("H");
  const [dateNais, setDateNais] = useState(null);
  const [c, setC] = useState("");
  const [cin, setCin] = useState("");

  const handleSaveDialog = (data) => {
    const user = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.mail,
      codeClient: c,
      role: "CLIENT",
      dateNaiss: dateNais,
      sexe: sexe,
      cin: data.cin,
    };
    console.log("User data to be submitted:", user);

    userService
      .creerUser(user)
      .then(() => {
        handleClick();
        navigate("/admin/demandeurs");
        reset();
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const handleChangeSexe = (event) => {
    setSexe(event.target.value);
  };

  const handleCancel = () => {
    navigate("/admin/demandeurs");
  };

  return (
    <Box sx={{minHeight: "calc(88vh - 64px)"}}>
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        p: 3,
        mt: 4,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
        height: "auto",
      }}
    >
      <Header
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddAltOutlined />
            Ajouter un nouveau demandeur
          </Box>
        }
        subTitle=""
      />
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleSaveDialog)}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("nom", { required: "Nom est requis", minLength: { value: 3, message: "Minimum 3 caractères" } })}
              label="Nom"
              variant="outlined"
              autoFocus
              fullWidth
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
                clearErrors("nom");
              }}
              error={!!errors.nom}
              helperText={errors.nom?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("prenom", { required: "Prénom est requis", minLength: { value: 3, message: "Minimum 3 caractères" } })}
              label="Prénom"
              fullWidth
              variant="outlined"
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value);
                clearErrors("prenom");
              }}
              error={!!errors.prenom}
              helperText={errors.prenom?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register("mail", { required: "Adresse email est requise", pattern: { value: regEmail, message: "Email invalide" } })}
              label="Adresse email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearErrors("mail");
              }}
              error={!!errors.mail}
              helperText={errors.mail?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("cin", { required: "Numéro de carte d'identité est requis", minLength: { value: 8, message: "Doit avoir 8 caractères" }, maxLength: { value: 8, message: "Doit avoir 8 caractères" } })}
              label="Numéro de carte d'identité"
              variant="outlined"
              fullWidth
              value={cin}
              onChange={(e) => {
                setCin(e.target.value);
                clearErrors("cin");
              }}
              error={!!errors.cin}
              helperText={errors.cin?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              disablePortal
              options={client}
              getOptionLabel={(option) => option.nomSociete}
              sx={{ width: "100%" }}
              onChange={(event, value) => {
                setC(value.codeClient);
                clearErrors("codeC");
                console.log(value.codeClient);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  {...register("codeC", { required: "Client est requis" })}
                  error={!!errors.codeC}
                  helperText={errors.codeC?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={frLocale}
            >
              <Stack spacing={2}>
                <DatePicker
                  label="Date de naissance"
                  value={dateNais}
                  onChange={(date) => {
                    setDateNais(date);
                    clearErrors("dateNais");
                  }}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...register("dateNais", { required: "Date de naissance est requise" })}
                      error={!!errors.dateNais}
                      helperText={errors.dateNais?.message}
                    />
                  )}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <Typography component="legend" sx={{ mr: 2 }}>
                Sexe :
              </Typography>
              <RadioGroup row value={sexe} onChange={handleChangeSexe}>
                <FormControlLabel value="H" control={<Radio />} label="H" />
                <FormControlLabel value="F" control={<Radio />} label="F" />
              </RadioGroup>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right"}}>
            <Button
          variant="outlined"
          color="error"
          sx={{ borderRadius: 10, width: 100, mr: 2 }}
          onClick={handleCancel}
        >
          Annuler
        </Button>
            <Button type="submit" variant="outlined" color="primary" sx={{borderRadius:10,width:100 }}>
              Créer
            </Button>
          </Grid>
          </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Compte créé avec succès
          </Alert>
        </Snackbar>
      </Box>
    </Box>
    </Box>
  );
};

export default AjoutEquipe;
