import { useState, useEffect } from "react";
import {
  Button,
  useTheme,
  TextField,
  Box,
  styled,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardActions,
  alpha,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { natureService } from "../../services/nature_service";
import Header from "../../admin/components/Header";
import InputBase from "@mui/material/InputBase";

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
    width: "100px",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const NaturePage = () => {
  const theme = useTheme();

  const [natures, setNatures] = useState([]);
  const [libelle, setLibelle] = useState("");
  const [editCode, setEditCode] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);
  const [libelleError, setLibelleError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNatures();
  }, []);

  const loadNatures = async () => {
    try {
      const response = await natureService.getAllNature();
      setNatures(response.data);
    } catch (error) {
      console.error("Error fetching nature data:", error);
    }
  };

  const handleAddNature = async () => {
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      return;
    }

    const nature = { libelle };
    try {
      await natureService.addNature(nature);
      clearForm();
      setOpenDialog(false);
      loadNatures();
      setSnackbarSeverity("success");
      setSnackbarMessage("La nature a été ajoutée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding nature:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout de la nature");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteNature = async (code) => {
    try {
      await natureService.deleteNature(code);
      loadNatures();
      setSnackbarSeverity("success");
      setSnackbarMessage("La nature a été supprimée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting nature:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression de la nature");
      setSnackbarOpen(true);
    }
  };

  const handleEditNature = (nature) => {
    setEditCode(nature.code);
    setLibelle(nature.libelle);
    setOpenDialog(true);
  };

  const handleUpdateNature = async () => {
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      return;
    }

    const nature = { code: editCode, libelle };
    try {
      await natureService.updateNature(nature);
      clearForm();
      setOpenDialog(false);
      loadNatures();
      setSnackbarSeverity("success");
      setSnackbarMessage("La nature a été mise à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating nature:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour de la nature");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearForm();
  };

  const clearForm = () => {
    setEditCode(null);
    setLibelle("");
    setLibelleError("");
  };

  const handleLibelleChange = (e) => {
    setLibelle(e.target.value);
    setLibelleError("");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // const clearSearch = () => {
  //   setSearchQuery("");
  // };

  const filteredNatures = natures.filter((nature) =>
    nature.libelle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="5px"
          sx={{
            fontWeight: 500,
          }}
        >
          Natures
        </Typography>
        <Button
          onClick={() => setOpenDialog(true)}
          variant="contained"
          sx={{
            backgroundColor:
              theme.palette.mode === "light" ? "#cbe2ec" : "#3d464d",
            color: theme.palette.mode === "light" ? "#000" : "#fff",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light" ? "#9dcadc" : "#363d43",
            },
          }}
          startIcon={<AddIcon />}
        >
          Ajouter une nature
        </Button>
      </Box>
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
          minHeight: 400,
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
            alignItems: "center",
            justifyContent: "space-between",
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
                Liste des natures
              </Box>
            }
            subTitle=""
          />
          <Search
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#e7f1f7" : "#6d6d6d",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "#cbe2ec" : "#9cb8c4",
              },
              width: "200px",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Search>
        </Box>

        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Rechercher"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <>
                  {searchQuery && (
                    <IconButton onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </>
              )
            }}
          />
        </div>
      </div> */}
        <Grid container spacing={1}>
          {filteredNatures.map((nature) => (
            <Grid item xs={12} sm={6} md={3} key={nature.code}>
              <Card
                sx={{
                  backgroundColor:
                    theme.palette.mode === "light" ? "#f3f8fb" : "#292929",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                  marginLeft:"20px",
                  marginBottom: "16px",
                  transition: "transform 0.2s ease-in-out",
                  width: "auto",
                  border: "none",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {nature.libelle}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton
                    onClick={() => handleEditNature(nature)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => setDeleteCode(nature.code)}>
                    <DeleteIcon  />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle>
          {editCode ? "Modifier la Nature" : "Ajouter une Nature"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Libellé"
            value={libelle}
            onChange={handleLibelleChange}
            fullWidth
            margin="normal"
            error={!!libelleError}
            helperText={libelleError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={editCode ? handleUpdateNature : handleAddNature}>
            {editCode ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteCode} onClose={() => setDeleteCode(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette nature ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCode(null)}>Annuler</Button>
          <Button
            onClick={() => {
              handleDeleteNature(deleteCode);
              setDeleteCode(null);
            }}
            variant="contained"
            color="error"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NaturePage;
