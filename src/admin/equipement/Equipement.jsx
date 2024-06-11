import "./Equipement.css";
import {
  Box,
  Button,
  Checkbox,
  Container,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Tabs,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
// @ts-ignore
import { useEffect } from "react";
import dateFormat from "dateformat";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import esLocale from "date-fns/locale/es";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";
import { adminService } from "../../services/equipement_service";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "30%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Equipement = () => {
  let navigate = useNavigate();

  const [type, setType] = React.useState([]); // Initialiser l'état type avec un tableau vide
  const [famille, setFamille] = React.useState([]); // Initialiser l'état famille avec un tableau vide

  const loadType = async () => {
    try {
      const response = await adminService.getAllTypes();
      setType(response.data); // Mettre à jour l'état type avec les données récupérées de l'API
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadType();
    loadFamille();
  }, []); // Assurez-vous de passer un tableau vide pour exécuter ces fonctions une seule fois au montage du composant

  const loadFamille = async () => {
    try {
      const response = await adminService.getAllFamilles();
      //  axios.get(
      //   "http://localhost:8086/tickets/api/allFamille"
      // );
      setFamille(response.data); // Mettre à jour l'état famille avec les données récupérées de l'API
    } catch (error) {
      console.error("Error fetching famille data:", error);
    }
  };

  const theme = useTheme();
  const color = theme.palette.mode === "light" ? "#502bfc" : "#8a81ff"; // Modifier les couleurs en fonction du mode

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // @ts-ignore
  // @ts-ignore
  const [openDialog, setOpenDialog] = React.useState(false);
  // @ts-ignore
  // @ts-ignore
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  // @ts-ignore
  const [confirmUpdateOpen, setConfirmUpdateOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState(null);

  const handleClickOpen = () => {
    setOpenDialog(true);
    navigate("addEquipement");
    reset();
  };

  const onSubmit = (data) => {
    console.log(data);
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const [updated, setUpdated] = React.useState();

  const handleClickMenu = (event, eq) => {
    setAnchorEl(event.currentTarget);
    setDeleteItem(eq.eqptCode); // Stocker l'objet complet
    setUpdated(eq);
    console.log("eq", eq);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // @ts-ignore
  const handleDeleteConfirmOpen = (event, selectedItem) => {
    console.log("selectedItem", selectedItem);
    setConfirmDeleteOpen(true);
    console.log("selectedItem***", selectedItem.eqptCode);
    handleCloseMenu();
  };

  const handleDeleteConfirmClose = () => {
    setConfirmDeleteOpen(false);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteEquipement(deleteItem);
      console.log("****", deleteItem);
      loadEqpm();
      setConfirmDeleteOpen(false);
      setDeleteItem(null); // Réinitialiser deleteItem après la suppression
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // @ts-ignore
  const [eqpm, setEqpm] = React.useState([]);

  //modification
  const [codeValue, setCodeValue] = React.useState("");
  const [designationValue, setDesignationValue] = React.useState("");
  const [typeValue, setTypeValue] = React.useState("");
  const [familleValue, setFamilleValue] = React.useState("");
  const [identifiantValue, setIdentifiantValue] = React.useState("");
  const [dt_achatValue, setDateAchatValue] = React.useState(null);
  const [garantieValue, setGarantieValue] = React.useState("O");
  const [dt_creationValue, setDateCreationValue] = React.useState(null);
  const [critiqueValue, setCritiqueValue] = React.useState("N");
  const [localisationValue, setLocalisationValue] = React.useState("");
  const [enserviceValue, setEnServiceValue] = React.useState("O");
  // const [eqClient, setEqClient] = React.useState(eqty_client);
  const [login_creValue, setLoginCreValue] = React.useState("");
  const [login_mjValue, setLoginMJValue] = React.useState("");
  const [machineValue, setMachineValue] = React.useState("N");
  const [prixValue, setPrixValue] = React.useState(0.0);
  const [user_cb1Value, setUserCB1Value] = React.useState("");
  const [type_garantieValue, setTypeGarantieValue] = React.useState("");
  const [siteValue, setSiteValue] = React.useState("");
  const [centreValue, setCentreValue] = React.useState("");
  const [postValue, setPostValue] = React.useState("");
  const [ressValue, setRessValue] = React.useState("");
  const [eq_type_garantie, setEqTypeGarantie] = React.useState("AUC");
  const [duregValue, setDureGValue] = React.useState(0);
  const [dt_fingValue, setDateFinGValue] = React.useState(null);
  const [articleValue, setArticleValue] = React.useState("");
  const [eq_dt_fab, setEqDateFab] = React.useState(null);
  const [eq_dt_livraison, setEqDateLivraison] = React.useState(null);
  const [eq_dt_ms_en_service, setEqDateMService] = React.useState(null);
  const [eq_dt_installation, setEqDateInstallation] = React.useState(null);
  const [eq_dt_demo, setEqDateDemo] = React.useState(null);
  const [eq_dt_remplacement, setEqDateRemplacement] = React.useState(null);
  // @ts-ignore
  const [eq_lot, setLot] = React.useState("");
  // @ts-ignore
  const [eq_Num_serie, setNumSerie] = React.useState("");

  const handleUpdateConfirmOpen = () => {
    setConfirmUpdateOpen(true);
    // @ts-ignore
    setDeleteItem(updated.eqptCode); // Stocker l'objet complet
    // @ts-ignore
    setCodeValue(updated.eqptCode); // Pré-remplir les champs de saisie avec les valeurs de l'élément sélectionné
    // @ts-ignore
    setDesignationValue(updated.eqptDesignation);
    // @ts-ignore
    setTypeValue(updated.type);
    // @ts-ignore
    setFamilleValue(updated.famille);
    // @ts-ignore
    setIdentifiantValue(updated.eqptId);
    // @ts-ignore
    const date = dateFormat(updated.eqptDtAchat, "{yyyy-MM-dd}");
    console.log("dateFormat", date);
    const d1 = date["yyyy"];
    console.log("d1", d1);
    // @ts-ignore
    setDateAchatValue(updated.eqptDtAchat);
    // @ts-ignore
    setGarantieValue(updated.eqptGarantie);
    // @ts-ignore
    setCritiqueValue(updated.eqptCritique);
    // @ts-ignore
    setDateCreationValue(updated.eqptDtCreation);
    // @ts-ignore
    setLocalisationValue(updated.eqptLocalisation);
    // @ts-ignore
    setEnServiceValue(updated.eqptEnService);
    // @ts-ignore
    setLoginCreValue(updated.eqptLoginCreation);
    // @ts-ignore
    setLoginMJValue(updated.eqptLoginMaj);
    // @ts-ignore
    setMachineValue(updated.eqptMachine);
    // @ts-ignore
    setPrixValue(updated.eqptPrix);
    // @ts-ignore
    setUserCB1Value(updated.eqptUserCB1);
    // @ts-ignore
    setTypeGarantieValue(updated.eqptGarTypeDtRef);
    // @ts-ignore
    setSiteValue(updated.siteCode);
    // @ts-ignore
    setCentreValue(updated.centreCode);
    // @ts-ignore
    setPostValue(updated.postCode);
    // @ts-ignore
    setRessValue(updated.ressCode);
    // @ts-ignore
    setEqTypeGarantie(updated.eqptGarTypeDtRef);
    // @ts-ignore
    setDureGValue(updated.eqptDureeGarantie);
    // @ts-ignore
    setDateFinGValue(updated.dateFinGarantie);
    // @ts-ignore
    setArticleValue(updated.articleCode);
    // @ts-ignore
    setEqDateFab(updated.dateFabrication);
    // @ts-ignore
    setEqDateLivraison(updated.dateLivraison);
    // @ts-ignore
    setEqDateMService(updated.dateMiseEnService);
    // @ts-ignore
    setEqDateInstallation(updated.dateInstallation);
    // @ts-ignore
    setEqDateDemo(updated.dateDemontage);
    // @ts-ignore
    setEqDateRemplacement(updated.dateRemplacement);
    // @ts-ignore
    setLot(updated.eqptNumeroSerie);
    // @ts-ignore
    setNumSerie(updated.eqptLotNumero);
  };

  const handleUpdateConfirmClose = () => {
    setConfirmUpdateOpen(false);
    handleCloseMenu();
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItem = {
        eqptCode: codeValue,
        eqptDesignation: designationValue,
        type: typeValue,
        famille: familleValue,
        eqptId: identifiantValue,
        eqptDtAchat: dt_achatValue,
        eqptGarantie: garantieValue,
        eqptCritique: critiqueValue,
        eqptDtCreation: dt_creationValue,
        eqptDtMaj: new Date(),
        eqptLocalisation: localisationValue,
        eqptEnService: enserviceValue,
        eqptLoginCreation: login_creValue,
        eqptLoginMaj: login_mjValue,
        eqptMachine: machineValue,
        eqptPrix: prixValue,
        eqptUserCB1: user_cb1Value,
        eqptGarTypeDtRef: type_garantieValue,
        siteCode: siteValue,
        dateFabrication: eq_dt_fab,
        dateLivraison: eq_dt_livraison,
        dateMiseEnService: eq_dt_ms_en_service,
        dateInstallation: eq_dt_installation,
        dateRemplacement: eq_dt_remplacement,
        ressCode: ressValue,
        postCode: postValue,
        eqptDureeGarantie: duregValue,
        dateFinGarantie: dt_fingValue,
        dateDemontage: eq_dt_demo,
        articleCode: articleValue,
        centreCode: centreValue,
        eqptLotNumero: eq_lot,
        eqptNumeroSerie: eq_Num_serie,
      };
      if (!designationValue.trim()) {
        console.error("Le code et le libellé ne peuvent pas être vides.");
        return; // Sortir de la fonction si le libellé est vide
      }
      await adminService.updateEquipement(), updatedItem;
      loadEqpm();
      setConfirmUpdateOpen(false);
      handleCloseMenu();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleChangeCritique = (event) => {
    setCritiqueValue(event.target.checked ? "O" : "N");
  };

  const handleChangeService = (event) => {
    setEnServiceValue(event.target.checked ? "O" : "N");
  };

  const handleChangeMachine = (event) => {
    setMachineValue(event.target.checked ? "O" : "N");
  };

  const handleChangeGarantie = (event) => {
    setGarantieValue(event.target.checked ? "O" : "N");
  };
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchInputValue, setSearchInputValue] = React.useState("");

  useEffect(() => {
    loadEqpm();
  }, []);

  const loadEqpm = async () => {
    try {
      const response = await adminService.getAllEquipements();
      // axios.get("http://localhost:8086/tickets/api/all");
      setEqpm(response.data); // Mettre à jour l'état local avec les données récupérées

      setSearchResults(response.data); // Initialiser searchResults avec toutes les données
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Filter = async (event) => {
    const libelle = event.target.value.toLowerCase();
    setSearchInputValue(libelle); // Mettre à jour la valeur de recherche
    try {
      if (libelle.trim() === "") {
        // Si le champ de recherche est vide, charger tous les équipements
        await loadEqpm();
      } else {
        const response = await adminService.FilterEquipement(libelle);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const [value, setValue] = React.useState(0);

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }; // Ajouter cette accolade pour fermer la fonction handleChange

  // const dt_achattValue = new Date(); // Crée une instance de Date avec la date actuelle
  // console.log(dt_achattValue)

  return (
    <Box sx={{ gap: 3 }} my={2}>
      <Container>
        <Stack
          direction={"row"}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          width={"100%"}
        >
          <Search
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#a4a6fd" : "#292e42",
              flex: 1,
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ "aria-label": "search" }}
              value={searchInputValue || ""} // Assurez-vous que la valeur est une chaîne de caractères valide
              onChange={Filter}
            />
          </Search>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
            }}
          >
            <React.Fragment>
              <Button
                variant="outlined"
                onClick={handleClickOpen}
                sx={{
                  color: theme.palette.mode === "light" ? "#613fe7" : "#a4a6fd",
                  borderColor:
                    theme.palette.mode === "light" ? "#613fe7" : "#a4a6fd",
                  "&:hover": {
                    color:
                      theme.palette.mode === "light" ? "#5736cc" : "#867ffa",
                    borderColor:
                      theme.palette.mode === "light" ? "#5736cc" : "#867ffa",
                  },
                }}
              >
                Ajouter
              </Button>
            </React.Fragment>
          </div>
        </Stack>
      </Container>
      <Box sx={{ gap: 30 }} my={4}></Box>
      <main className="flex">
        <section className="flex right-section">
          {searchInputValue !== "" && searchResults.length === 0 && (
            <p>Aucun résultat trouvé pour `{searchInputValue}`</p>
          )}
          {searchResults.map((eqm) => (
            <article key={`${eqm.eqptCode}`} className="card">
              {/* Affichez les données de chaque type dans les cartes */}
              <div
                style={{ position: "relative", width: "266px" }}
                className="box"
              >
                <div style={{ position: "absolute", top: "0", right: "0" }}>
                  <Button
                    id={`basic-button-${eqm.eqptCode}`}
                    aria-controls={`basic-menu-${eqm.eqptCode}`}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? "true" : undefined}
                    onClick={(event) => handleClickMenu(event, eqm)} // Passer l'objet complet
                    endIcon={<MoreVertOutlinedIcon />}
                    sx={{ color: color }}
                  ></Button>

                  <Menu
                    id={`basic-menu-${eqm.eqptCode}`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      "aria-labelledby": `basic-button-${eqm.eqptCode}`,
                    }}
                  >
                    <MenuItem onClick={() => handleUpdateConfirmOpen()}>
                      {" "}
                      Modifier{" "}
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => handleDeleteConfirmOpen(event, eqm)}
                    >
                      {" "}
                      Supprimer
                    </MenuItem>
                  </Menu>
                </div>
                {/* Insérez ici les éléments de votre carte */}
                <h1 className="designation">
                  Designation: {eqm.eqptDesignation}
                </h1>
                <p className="code">Code: {eqm.eqptCode}</p>
                <div className="flex icons">
                  <div style={{ gap: "11px" }} className="flex"></div>
                  <Link
                    className="link flex"
                    to={`./details?eqptCode=${eqm.eqptCode}`}
                    onClick={() => {
                      console.log("eqptCode:", eqm.eqptCode);
                    }}
                    style={{ color: color }}
                  >
                    plus
                    <span
                      style={{ alignSelf: "end" }}
                      className="icon-arrow-right"
                    ></span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Dialog pour la confirmation de suppression */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet élément ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: color }}
            onClick={() =>
              handleDeleteConfirm(
                // @ts-ignore
                deleteItem
              )
            }
            autoFocus
          >
            Oui
          </Button>
          <Button onClick={handleDeleteConfirmClose} sx={{ color: color }}>
            Non
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la confirmation de modification */}
      <Dialog
        open={confirmUpdateOpen}
        onClose={handleUpdateConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Modifier</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Modifier les champs suivants :
          </DialogContentText>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            noValidate
            autoComplete="off"
          >
            {/* Les champs de texte */}
            <Stack sx={{ gap: 2 }} direction={"row"}>
              <TextField
                error={Boolean(errors.code)}
                helperText={errors.code ? "Ce champ est obligatoire" : null}
                {...register("code", { required: true, maxLength: 20 })}
                sx={{ flex: 1 }}
                label="Code"
                variant="outlined"
                value={codeValue}
                disabled={true}
                onChange={(e) => setCodeValue(e.target.value)}
              />
              <TextField
                error={Boolean(errors.desig)}
                helperText={errors.desig ? "Ce champ est obligatoire" : null}
                {...register("desig", {
                  required: true,
                  maxLength: 50,
                })}
                sx={{ flex: 1 }}
                label="Designation"
                variant="outlined"
                value={designationValue}
                onChange={(e) => setDesignationValue(e.target.value)}
              />
            </Stack>
            <TextField
              sx={{ flex: 1 }}
              label="Identifiant "
              variant="outlined"
              value={identifiantValue}
              onChange={(e) => setIdentifiantValue(e.target.value)}
            />
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={critiqueValue === "O"}
                    onChange={handleChangeCritique}
                    sx={{
                      color: color,
                      "&.Mui-checked": {
                        color: color,
                      },
                    }}
                  />
                }
                label="Critique"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enserviceValue === "O"}
                    onChange={handleChangeService}
                    sx={{
                      color: color,
                      "&.Mui-checked": {
                        color: color,
                      },
                    }}
                  />
                }
                label="En service"
              />
            </FormGroup>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Général" {...a11yProps(0)} />
                <Tab label="Réference" {...a11yProps(1)} />
                <Tab label="Historique" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    value={typeValue}
                    options={type}
                    getOptionLabel={(option) => option.eqtyLibelle} // Utilise la propriété 'libelle' comme label
                    isOptionEqualToValue={(option, value) =>
                      option.eqtyCode === value.eqtyCode
                    } // Exemple de fonction de comparaison personnalisée
                    // @ts-ignore
                    onChange={(event, value) => {
                      setTypeValue(value);
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Equipement type"
                        {...register("codeType", { required: true })}
                        error={Boolean(errors.codeType)}
                        helperText={
                          errors.codeType ? "Ce champ est obligatoire" : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo-famille"
                    value={familleValue}
                    options={famille}
                    getOptionLabel={(option) => option.eqfaLibelle} // Utilise la propriété 'libelle' comme label
                    isOptionEqualToValue={(option, value) =>
                      option.eqfaCode === value.eqfaCode
                    } // Exemple de fonction de comparaison personnalisée
                    // @ts-ignore
                    onChange={(event, value) => {
                      setFamilleValue(value);
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Equipement famille" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Site"
                    variant="outlined"
                    value={siteValue}
                    // @ts-ignore
                    onChange={(e) => setSiteValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Centre"
                    variant="outlined"
                    value={centreValue}
                    // @ts-ignore
                    onChange={(e) => setCentreValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Localisation"
                    variant="outlined"
                    value={localisationValue}
                    onChange={(e) => setLocalisationValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Article"
                    variant="outlined"
                    value={articleValue}
                    // @ts-ignore
                    onChange={(e) => setArticleValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Post"
                    variant="outlined"
                    value={postValue}
                    // @ts-ignore
                    onChange={(e) => setPostValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Ress"
                    variant="outlined"
                    value={ressValue}
                    // @ts-ignore
                    onChange={(e) => setRessValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Prix"
                    variant="outlined"
                    type="number"
                    value={prixValue}
                    onChange={(e) => setPrixValue(parseFloat(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Numero de lot"
                    variant="outlined"
                    value={eq_lot}
                    onChange={(e) => setLot(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Numero de serie"
                    variant="outlined"
                    value={eq_Num_serie}
                    onChange={(e) => setNumSerie(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={machineValue === "O"}
                          onChange={handleChangeMachine}
                          sx={{
                            color: color,
                            "&.Mui-checked": {
                              color: color,
                            },
                          }}
                        />
                      }
                      label="Machine"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={garantieValue === "O"}
                          onChange={handleChangeGarantie}
                          sx={{
                            color: color,
                            "&.Mui-checked": {
                              color: color,
                            },
                          }}
                        />
                      }
                      label="Garantie"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Type de garantie"
                    value={eq_type_garantie}
                    onChange={(e) => setEqTypeGarantie(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Durée"
                    variant="outlined"
                    type="number"
                    value={duregValue}
                    onChange={(e) => setDureGValue(parseFloat(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Date fin garantie"
                      value={dt_fingValue}
                      onChange={(date) => setDateFinGValue(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Date de fabrication"
                      value={eq_dt_fab}
                      onChange={(date) => setEqDateFab(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Date de livraison"
                      value={eq_dt_livraison}
                      onChange={(date) => setEqDateLivraison(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Mise en service"
                      value={eq_dt_ms_en_service}
                      onChange={(date) => setEqDateMService(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Date d'achat"
                      value={dt_achatValue}
                      onChange={(date) => setDateAchatValue(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Installation"
                      value={eq_dt_installation}
                      onChange={(date) => setEqDateInstallation(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Date de demonstration"
                      value={eq_dt_demo}
                      onChange={(date) => setEqDateDemo(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    // @ts-ignore
                    locale={esLocale}
                  >
                    <DatePicker
                      label="Date de remplacement"
                      value={eq_dt_remplacement}
                      onChange={(date) => setEqDateRemplacement(date)}
                      // @ts-ignore
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CustomTabPanel>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateItem} sx={{ color: color }}>
            Modifier
          </Button>
          <Button onClick={handleUpdateConfirmClose} sx={{ color: color }}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Equipement;
