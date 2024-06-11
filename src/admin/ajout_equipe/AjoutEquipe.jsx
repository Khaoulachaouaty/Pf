import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user_service";
import { PersonAddAltOutlined } from "@mui/icons-material";
import { departementService } from "../../services/departement_service";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import frLocale from "date-fns/locale/fr";
import addYears from "date-fns/addYears";

const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const roleList = [
  { value: "MANAGER", label: "Manager" },
  { value: "TECHNICIEN", label: "Technicien" },
  { value: "MAGASINIER", label: "Magasinier" },
];

const AjoutEquipe = () => {
  const navigate = useNavigate();
  const [dep, setDep] = useState([]);
  
  const handleCancel = () => {
    navigate("/admin/employes");
  };

  const loadDepartement = async () => {
    try {
      const res = await departementService.getAllDepartements();
      setDep(res.data);
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    loadDepartement();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    trigger,
    clearErrors,
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

  const [sexe, setSexe] = useState("H");
  const [responsable, setResponsable] = useState(false);
  const [depart, setDepart] = useState("");
  const [role, setRole] = useState("");

  const handleSaveDialog = (data) => {
    if (!data.date || !data.dateNais) {
      trigger(["date", "dateNais"]);
      return;
    }
    const user = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.mail,
      dateEmbauche: data.date,
      dateNaiss: data.dateNais,
      role: data.role,
      sexe: sexe,
      responsable: responsable ? "O" : "N",
      codeDepart: depart,
      cin: data.cin,
    };
    console.log("User data to be submitted:", user);

    userService
      .creerUser(user)
      .then(() => {
        handleClick();
        navigate("/admin/employes");
        reset();
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const handleChangeSexe = (event) => {
    setSexe(event.target.value);
  };

  const [showResponsable, setShowResponsable] = useState(false);
  const [showDepartement, setShowDepartement] = useState(false);
  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    setValue("role", selectedRole); // Met à jour la valeur du rôle dans le formulaire
    clearErrors("role"); // Efface les erreurs associées au rôle
    setShowResponsable(selectedRole === "TECHNICIEN");
    setShowDepartement(selectedRole === "TECHNICIEN");
  };

  const currentDate = new Date();

  return (
    <Box
      sx={{
        maxWidth: 560,
        mx: "auto",
        p: 3,
        mt: 0,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
        minHeight: "calc(88vh - 64px)",
      }}
    >
      <Header
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddAltOutlined />
            Ajouter un nouveau employé
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
              {...register("nom", {
                required: "Nom est requis",
                minLength: {
                  value: 3,
                  message: "Nom doit avoir au moins 3 caractères",
                },
              })}
              label="Nom"
              autoFocus
              variant="outlined"
              fullWidth
              error={Boolean(errors.nom)}
              helperText={errors.nom?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("prenom", {
                required: "Prénom est requis",
                minLength: {
                  value: 3,
                  message: "Prénom doit avoir au moins 3 caractères",
                },
              })}
              label="Prénom"
              fullWidth
              variant="outlined"
              error={Boolean(errors.prenom)}
              helperText={errors.prenom?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("mail", {
                required: "Email est requis",
                pattern: { value: regEmail, message: "Email non valide" },
              })}
              label="Adresse email"
              variant="outlined"
              fullWidth
              error={Boolean(errors.mail)}
              helperText={errors.mail?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Role"
              {...register("role", { required: "Role est requis" })}
              placeholder="Selectionner un rôle"
              value={role}
              fullWidth
              onChange={handleRoleChange}
              error={Boolean(errors.role)}
              helperText={errors.role?.message}
            >
              {roleList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {showResponsable && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                options={dep}
                getOptionLabel={(option) => option.nomDepart}
                onChange={(event, value) => setDepart(value.codeDepart)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Département"
                    {...register("codeDep", {
                      required: "Département est requis",
                    })}
                    error={Boolean(errors.codeDep)}
                    helperText={errors.codeDep?.message}
                  />
                )}
              />
            </Grid>
          )}

          {showDepartement && (
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={responsable}
                    onChange={(e) => setResponsable(e.target.checked)}
                  />
                }
                label="Responsable"
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("cin", {
                required: "CIN est requis",
                pattern: {
                  value: /^[0-9]{8}$/,
                  message: "CIN doit être composé de 8 chiffres",
                },
              })}
              label="Numéro de carte d'identité"
              variant="outlined"
              fullWidth
              error={Boolean(errors.cin)}
              helperText={errors.cin?.message}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={frLocale}
            >
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date d'embauche est requise" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date d'embauche"
                    inputFormat="dd/MM/yyyy"
                    disableFuture
                    maxDate={currentDate}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={Boolean(errors.date)}
                        helperText={errors.date?.message}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={frLocale}
            >
              <Controller
                name="dateNais"
                control={control}
                rules={{ required: "Date de naissance est requise" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date de naissance"
                    inputFormat="dd/MM/yyyy"
                    disableFuture
                    maxDate={addYears(currentDate, -18)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={Boolean(errors.dateNais)}
                        helperText={errors.dateNais?.message}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
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
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Employé ajouté avec succès!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AjoutEquipe;
