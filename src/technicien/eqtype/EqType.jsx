import "./EqType.css";
import {
  Box,
  Button,
  Typography,
  DialogTitle,
  styled,
  useTheme,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import Header from "../../admin/components/Header";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useEffect } from "react";
import { RadioButtonChecked } from "@mui/icons-material";
import { adminService } from "../../services/equipement_service";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "200px", // Ajuster la largeur du composant de recherche
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
    width: "100px", // Largeur fixe de l'entrée de texte
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const EqType = () => {
  const theme = useTheme();
  const color = theme.palette.mode === "light" ? "#5183a6" : "#a4c0d5"; // Modifier les couleurs en fonction du mode

  const [errorSnackbar, setErrorSnackbar] = React.useState({
    open: false,
    message: "",
  });
  const [deleteSnackbar, setDeleteSnackbar] = React.useState(false);

  const handleCloseDeleteSnackbar = () => {
    setDeleteSnackbar(false);
  };

  const cardStyles = {
    backgroundColor: theme.palette.mode === "light" ? "#f3f8fb" : "#292929",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    marginBottom: "16px",
    transition: "transform 0.2s ease-in-out",
    width: "310px", // Largeur des cartes
    border: "none", // Éliminer le contour
  };

  const cardContentStyles = {
    display: "flex",
    flexDirection: "column",
  };

  const libelleStyles = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const codeStyles = {
    fontSize: "1rem",
    color: theme.palette.mode === "light" ? "#666666" : "#e7e7e7",
  };

  // State pour les champs de la boîte de dialogue d'ajout
  const [eqty_libelle, setLibelle] = React.useState("");
  const [eqty_icone, setIcone] = React.useState("");
  const [eqty_machine, setValue] = React.useState("N");

  const handleSaveDialog = async (e) => {
    e.preventDefault();
    if (!eqty_libelle.trim()) {
      console.error("Le libellé ne peut pas être vide.");
      setErrorSnackbar({
        open: true,
        message: "Le libellé ne peut pas être vide.",
      });
      return; // Sortir de la fonction si le code ou le libellé est vide
    }

    // Vérifier si le nom de type existe déjà
    const existingType = types.find(
      (type) => type.eqtyLibelle.toLowerCase() === eqty_libelle.toLowerCase()
    );

    if (existingType) {
      console.error("Le libellé saisi existe déjà.");
      setErrorSnackbar({
        open: true,
        message: "Le libellé saisi existe déjà.",
      });
      return;
    }
    const eqt = {
      eqtyLibelle: eqty_libelle,
      eqtyMachine: eqty_machine,
      eqtyIcone: eqty_icone,
      dtCre: new Date(),
    };
    adminService
      .saveType(eqt)
      .then((response) => {
        console.log(response);
        // Ajouter l'équipement nouvellement ajouté à la liste existante
        setTypes((prevTypes) => [...prevTypes, response.data]);
        // Réinitialiser les champs
        reset();
        loadType();
        handleCloseDialog();
        setOpenDialog(false);
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
    reset();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLibelle("");
    setValue("N");
    setIcone("");
    reset();
  };

  const onSubmit = (data) => {
    console.log(data);
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const [updated, setUpdated] = React.useState();

  const handleClickMenu = (event, type) => {
    setAnchorEl(event.currentTarget);
    setDeleteItem(type.eqtyCode); // Stocker l'objet complet
    setUpdated(type);
    //handleUpdateConfirmOpen (event,type) ;
    console.log("type", type);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // @ts-ignore
  const handleDeleteConfirmOpen = (event, selectedItem) => {
    console.log("selectedItem*******", selectedItem);
    setConfirmDeleteOpen(true);
    //setDeleteItem(selectedItem.eqtyCode); // Stocker l'objet complet
    console.log("selectedItem", selectedItem.eqtyCode);
    handleCloseMenu();
  };

  const handleDeleteConfirmClose = () => {
    setConfirmDeleteOpen(false);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async (deleteItem) => {
    try {
      await adminService.deleteType(deleteItem);
      loadType();
      // Fermer la boîte de dialogue de confirmation et réinitialiser l'état
      setConfirmDeleteOpen(false);
      setDeleteItem(null); // Réinitialiser deleteItem après la suppression
      setDeleteSnackbar(true); // Afficher le Snackbar de suppression
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorSnackbar({ open: true, message: "Erreur lors de la suppression de l'équipement." });
    }
  };

  // State pour les champs de la boîte de dialogue de modification
  const [codeValue, setCodeValue] = React.useState("");
  const [libelleValue, setLibelleValue] = React.useState("");
  const [iconeValue, setIconeValue] = React.useState("");
  const [machineValue, setMachineValue] = React.useState("N");
  const [loginCreValue] = React.useState("");
  const [loginMajValue] = React.useState("");
  const [dtCreValue, setDtCreationValue] = React.useState(null);

  const handleUpdateConfirmClose = () => {
    setConfirmUpdateOpen(false);
    handleCloseMenu();
  };

  const handleUpdateConfirmOpen = () => {
    setConfirmUpdateOpen(true);
    // @ts-ignore
    setDeleteItem(updated.eqtyCode); // Stocker l'objet complet
    // @ts-ignore
    setCodeValue(updated.eqtyCode); // Pré-remplir les champs de saisie avec les valeurs de l'élément sélectionné
    // @ts-ignore
    setLibelleValue(updated.eqtyLibelle);
    // @ts-ignore
    setIconeValue(updated.eqtyIcone);
    // @ts-ignore
    setMachineValue(updated.eqtyMachine);
    // @ts-ignore
    setDtCreationValue(updated.dtCre);
    // @ts-ignore
    console.log("put", updated.eqtyCode);
    console.log("**************");
  };

  const handleUpdateItem = async () => {
    if (!libelleValue.trim()) {
      console.error("Le code et le libellé ne peuvent pas être vides.");
      setErrorSnackbar({ open: true, message: "Le libellé ne peut pas être vide." });      return; // Sortir de la fonction si le libellé est vide
    }

    const existingType = types.find(
      (type) => type.eqtyLibelle.toLowerCase() === libelleValue.toLowerCase()
    );

    if (existingType) {
      console.error("Le libellé saisi existe déjà.");
      setErrorSnackbar({
        open: true,
        message: "Le libellé saisi existe déjà.",
      });
      return;
    }

    try {
      const updatedItem = {
        eqtyCode: codeValue,
        eqtyLibelle: libelleValue,
        eqtyMachine: machineValue,
        eqtyIcone: iconeValue,
        loginMaj: loginMajValue,
        loginCre: loginCreValue,
        dtMaj: new Date(),
        dtCre: dtCreValue,
      };

      await adminService.updateType(updatedItem);
      // Rafraîchir la liste des éléments après la mise à jour réussie
      loadType();
      handleCloseMenu();
      setOpenSnackbar(true);
      // Fermer la boîte de dialogue de confirmation de modification
      setConfirmUpdateOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorSnackbar({ open: true, message: "Erreur lors de la modification de l'équipement." });
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [types, setTypes] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchInputValue, setSearchInputValue] = React.useState("");

  useEffect(() => {
    loadType();
  }, []);

  const loadType = async () => {
    try {
      const response = await adminService.getAllTypes();
      setTypes(response.data); // Mettre à jour l'état local avec les données récupérées
      console.log(types, "555555");
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
        await loadType();
      } else {
        const response = await adminService.FilterType(libelle);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // Ajout de cette ligne pour aligner verticalement les éléments
          marginBottom: 2,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="5px"
          sx={{
            fontWeight: 500, // épaisseur de la police
          }}
        >
          Equipements Type
        </Typography>
        <React.Fragment>
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{
              color: theme.palette.mode === "light" ? "#458783" : "#daedea",
              borderColor:
                theme.palette.mode === "light" ? "#458783" : "#daedea",
              "&:hover": {
                color: theme.palette.mode === "light" ? "#366b6a" : "#b5dad5",
                borderColor:
                  theme.palette.mode === "light" ? "#366b6a" : "#b5dad5",
              },
            }}
          >
            Ajouter
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
            <DialogContent>
              <DialogContentText>
                <Header
                  title="CRÉER UN EQUIPEMENT TYPE"
                  subTitle="Créer un nouveau equipement type"
                />
              </DialogContentText>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                noValidate
                autoComplete="off"
              >
                {/* Les champs de texte */}

                <TextField
                  error={!!errors.libelle}
                  helperText={errors.libelle?.message}
                  {...register("libelle", {
                    required: "Libellé est requis",
                    maxLength: { value: 30, message: "Maximum 30 caractères" },
                  })}
                  sx={{ flex: 1 }}
                  label="Libellé"
                  variant="outlined"
                  value={eqty_libelle}
                  onChange={(e) => {
                    setLibelle(e.target.value)
                    clearErrors("libelle")
                  }}
                />
                <TextField
                  sx={{ flex: 1 }}
                  label="Icône "
                  variant="outlined"
                  value={eqty_icone}
                  onChange={(e) => setIcone(e.target.value)}
                />
                <FormControl>
                  <FormLabel
                    id="demo-controlled-radio-buttons-group"
                    sx={{
                      color: theme.palette.mode === "light" ? "black" : "white",
                    }}
                  >
                    Machine
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={eqty_machine}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      value="O"
                      control={
                        <Radio
                          sx={{ color: color }}
                          checkedIcon={
                            <RadioButtonChecked sx={{ color: color }} />
                          }
                        />
                      } // Modifier la couleur du cercle intérieur ici
                      label="Oui"
                    />
                    <FormControlLabel
                      value="N"
                      control={
                        <Radio
                          sx={{ color: color }}
                          checkedIcon={
                            <RadioButtonChecked sx={{ color: color }} />
                          }
                        />
                      } // Modifier la couleur du cercle intérieur ici
                      label="Non"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ color: color }}>
                Annuler
              </Button>
              <Button
                onClick={(e) => {
                  handleSubmit(onSubmit)(e); // Appel de handleSubmit pour valider le formulaire
                  handleSaveDialog(e); // Appel de handleSaveDialog pour traiter les données
                }}
              >
                Ajouter
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </Box>
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.main
                : theme.palette.background.main,
            padding: "20px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center", // Centrer verticalement
            justifyContent: "space-between", // Espacer les éléments horizontalement
          }}
        >
          <Header
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                Liste des equipements Type
              </Box>
            }
            subTitle=""
          />
          <Search
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#f3f8fb" : "6d6d6d",
              width: "200px", // Ajuster la largeur du composant de recherche
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ "aria-label": "search" }}
              value={searchInputValue || ""}
              onChange={Filter}
            />
          </Search>
        </Box>
        <Box sx={{ gap: 3 }} my={1}>
          <main className="flex">
            <section
              className="flex right-section"
              style={{ justifyContent: "flex-start" }}
            >
              {searchInputValue !== "" && searchResults.length === 0 && (
                <p>Aucun résultat trouvé pour `{searchInputValue}`</p>
              )}
              {searchResults.map((type) => (
                <article
                  key={`${type.eqtyCode}`}
                  style={cardStyles}
                  className="card"
                >
                  {/* Affichez les données de chaque type dans les cartes */}
                  <div style={{ position: "relative" }} className="box">
                    <div style={{ position: "absolute", top: "0", right: "0" }}>
                      <Button
                        id={`basic-button-${type.eqtyCode}`}
                        aria-controls={`basic-menu-${type.eqtyCode}`}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? "true" : undefined}
                        onClick={(event) => handleClickMenu(event, type)} // Passer l'objet complet
                        endIcon={<MoreVertOutlinedIcon />}
                        sx={{ color: color }}
                      ></Button>

                      <Menu
                        id={`basic-menu-${type.eqtyCode}`}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                          "aria-labelledby": `basic-button-${type.eqtyCode}`,
                        }}
                      >
                        <MenuItem onClick={() => handleUpdateConfirmOpen()}>
                          Modifier
                        </MenuItem>
                        <MenuItem
                          onClick={(event) =>
                            handleDeleteConfirmOpen(event, type)
                          }
                        >
                          Supprimer
                        </MenuItem>
                      </Menu>
                    </div>
                    {/* Insérez ici les éléments de votre carte, par exemple : */}
                    <div style={cardContentStyles} className="card-content">
                      <h2 style={libelleStyles} className="libelle">
                        {type.eqtyLibelle}
                      </h2>
                      <p style={codeStyles} className="code">
                        Code: {type.eqtyCode}
                      </p>
                      <p style={codeStyles} className="icone">
                        Icone: {type.eqtyIcone}
                      </p>
                      <p style={codeStyles} className="machine">
                        Machine: {type.eqtyMachine === "O" ? "Oui" : "Non"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </main>
        </Box>
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
            {/* Les champs de saisie pré-remplis avec les valeurs de l'élément sélectionné */}
            <TextField
              fullWidth
              margin="normal"
              label="Code"
              variant="outlined"
              disabled={true}
              value={codeValue} // Utiliser une valeur vide si codeValue est nul
              onChange={(e) => setCodeValue(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Libellé"
              variant="outlined"
              value={libelleValue} // Utiliser une valeur vide si libelleValue est nul
              onChange={(e) => setLibelleValue(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Icône"
              variant="outlined"
              value={iconeValue || ""} // Utiliser une valeur vide si iconeValue est nul
              onChange={(e) => setIconeValue(e.target.value)}
            />

            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel
                component="legend"
                sx={{
                  color: theme.palette.mode === "light" ? "black" : "white",
                }}
              >
                Machine
              </FormLabel>
              <RadioGroup
                aria-label="machine"
                name="machine"
                value={machineValue} // Utiliser 'N' si machineValue est nul
                onChange={(e) => setMachineValue(e.target.value)}
                row
              >
                <FormControlLabel
                  value="O"
                  control={
                    <Radio
                      sx={{ color: color }}
                      checkedIcon={<RadioButtonChecked sx={{ color: color }} />}
                    />
                  }
                  label="Oui"
                />
                <FormControlLabel
                  value="N"
                  control={
                    <Radio
                      sx={{ color: color }}
                      checkedIcon={<RadioButtonChecked sx={{ color: color }} />}
                    />
                  }
                  label="Non"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateConfirmClose} sx={{ color: color }}>
              Annuler
            </Button>
            <Button onClick={handleUpdateItem} sx={{ color: color }}>
              Modifier
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar pour afficher les messages d'erreur */}
        <Snackbar
          open={errorSnackbar.open}
          autoHideDuration={3000}
          onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })}
        >
          <Alert
            onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorSnackbar.message}
          </Alert>
        </Snackbar>

        {/* Snackbar pour afficher le message de succès */}
        <Snackbar
          open={openSnackbar} // Utiliser openSnackbar au lieu de open
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)} // Fermer le Snackbar lorsqu'il est cliqué
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            équipement ajouté avec succès
          </Alert>
        </Snackbar>

        {/* Snackbar pour les succès de suppression */}
        <Snackbar
          open={deleteSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseDeleteSnackbar}
          //anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseDeleteSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Suppression réussie !
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default EqType;
