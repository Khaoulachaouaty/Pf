import "./EqType.css";
import {
  Box,
  Button,
  Container,
  DialogTitle,
  Stack,
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
import Header from "../components/Header";
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

const EqType = () => {
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#502bfc' : '#8a81ff'; // Modifier les couleurs en fonction du mode

  // State pour les champs de la boîte de dialogue d'ajout
  const [eqty_code, setCode] = React.useState("");
  const [eqty_libelle, setLibelle] = React.useState("");
  const [eqty_icone, setIcone] = React.useState("");
  const [eqty_machine, setValue] = React.useState("N");

  const handleSaveDialog = (e) => {
    e.preventDefault();
    if (!eqty_code.trim() || !eqty_libelle.trim()) {
      console.error("Le code et le libellé ne peuvent pas être vides.");
      return; // Sortir de la fonction si le code ou le libellé est vide
    }

    const eqt = {
      eqtyCode: eqty_code,
      eqtyLibelle: eqty_libelle,
      eqtyMachine: eqty_machine,
      eqtyIcone: eqty_icone,
      dtCre: new Date(),
    };
    adminService.saveType(eqt)
          .then((response) => {
          console.log(response);
          // Ajouter l'équipement nouvellement ajouté à la liste existante
          setTypes((prevTypes) => [...prevTypes, response.data]);
          // Réinitialiser les champs
          reset();
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState(null);

  const handleClickOpen = () => {
    setOpenDialog(true);
    reset();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCode("");
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
    } catch (error) {
      console.error("Error deleting item:", error);
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
      if (!libelleValue.trim()) {
        console.error("Le code et le libellé ne peuvent pas être vides.");
        return; // Sortir de la fonction si le libellé est vide
      }
      await adminService.updateType(updatedItem)
      // Rafraîchir la liste des éléments après la mise à jour réussie
      loadType();
      handleCloseMenu();
      // Fermer la boîte de dialogue de confirmation de modification
      setConfirmUpdateOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
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
        const response = await adminService.FilterType(libelle)
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

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
              <Button variant="outlined" onClick={handleClickOpen}
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
              }}>
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
                      error={Boolean(errors.code)}
                      helperText={
                        errors.code ? "Ce champ est obligatoire" : null
                      }
                      {...register("code", { required: true })}
                      sx={{ flex: 1 }}
                      label="Code"
                      variant="outlined"
                      value={eqty_code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <TextField
                      error={Boolean(errors.libelle)}
                      helperText={
                        errors.libelle
                          ? "Ce champ est obligatoire"
                          : null
                      }
                      {...register("libelle", {
                        required: true,
                        maxLength: 30,
                      })}
                      sx={{ flex: 1 }}
                      label="Libelle"
                      variant="outlined"
                      value={eqty_libelle}
                      onChange={(e) => setLibelle(e.target.value)}
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
                        sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }}
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
                            checkedIcon={<RadioButtonChecked sx={{ color: color }} />
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
                            checkedIcon={<RadioButtonChecked sx={{ color: color }} />
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
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: color,
                      "&:hover": {
                        backgroundColor: "#644fff",
                      },
                    }}
                    onClick={(e) => {
                      handleSubmit(onSubmit)(e); // Appel de handleSubmit pour valider le formulaire
                      handleSaveDialog(e); // Appel de handleSaveDialog pour traiter les données
                    }}
                  >
                    Ajouter
                  </Button>
                  <Button onClick={handleCloseDialog} sx={{ color: color }}>
                    Annuler
                  </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          </div>
        </Stack>
      </Container>
      <Box sx={{ gap: 30 }} my={4} ></Box>
      <main className="flex">
        <section className="flex right-section">
          {searchInputValue !== "" && searchResults.length === 0 && (
            <p>Aucun résultat trouvé pour `{searchInputValue}`</p>
          )}
          {searchResults.map((type) => (
            <article key={`${type.eqtyCode}`} className="card" >
              {/* Affichez les données de chaque type dans les cartes */}
              <div
                style={{ position: "relative", width: "295px" }}
                className="box"
              >
                <div style={{ position: "absolute", top: "0", right: "0" }}>
                  <Button
                    id={`basic-button-${type.eqtyCode}`}
                    aria-controls={`basic-menu-${type.eqtyCode}`}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? "true" : undefined}
                    onClick={(event) => handleClickMenu(event, type)} // Passer l'objet complet
                    endIcon={<MoreVertOutlinedIcon />}
                    sx={{color:color}}
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
                      onClick={(event) => handleDeleteConfirmOpen(event, type)}
                    >
                      Supprimer
                    </MenuItem>
                  </Menu>
                </div>
                {/* Insérez ici les éléments de votre carte, par exemple : */}

                <h1 className="libelle" >Libelle: {type.eqtyLibelle}</h1>
                <p className="code" >Code: {type.eqtyCode}</p>
                <p className="" style={{ color: "grey" }}>Icone: {type.eqtyIcone}</p>
                <p className="" style={{ color: "grey" }}>
                  Machine: {type.eqtyMachine == "O" ? "Oui" : "Non"}
                </p>
                {/* <p className="date" style={{ color: "grey" }}>
                  Date de création:{
                  {dayjs(type.dtCre).format("DD/MM/YYYY HH:mm")}
                </p>
                <p className="crea" style={{ color: "grey" }}>Créateur: {type.loginCre}</p>
                <p className="datMj" style={{ color: "grey" }}>
                  Date de mise à jour:
                  {type.dtMaj
                    ? dayjs(type.dtMaj).format("DD/MM/YYYY HH:mm")
                    : "pas encore"}
                </p> 
                <p className="loginMJ" style={{ color: "grey" }}>Nom: {type.loginMaj}</p>*/}
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
          <Button onClick={handleDeleteConfirmClose} sx={{ color: color }}>Non</Button>
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
            <FormLabel component="legend"   sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }}
            >Machine</FormLabel>
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
                  checkedIcon={<RadioButtonChecked sx={{ color: color }} />
                    }
                  />
                }
                label="Oui"
              />
              <FormControlLabel
                value="N"
                control={
                  <Radio
                  sx={{ color: color }}
                  checkedIcon={<RadioButtonChecked sx={{ color: color }} />
                    }
                    
                  />
                }
                label="Non"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateItem} sx={{color:color}}>
            Modifier
          </Button>
          <Button onClick={handleUpdateConfirmClose} sx={{color:color}} >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour afficher le message de succès */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
    </Box>
  );
};

export default EqType;
