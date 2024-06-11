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
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { causeService } from "../../services/cause_service";
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

const DepartementPage = () => {
  const theme = useTheme();

  const [causes, setCauses] = useState([]);
  const [codeCause, setCodeCause] = useState("");
  const [nomCause, setNomCause] = useState("");
  const [editCodeCause, setEditCodeCause] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteCodeCause, setDeleteCodeCause] = useState(null);
  const [nomCauseError, setNomCauseError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      const response = await causeService.getAllCauses();
      setCauses(response.data);
    } catch (error) {
      console.error("Error fetching causes:", error);
    }
  };

  const handleAddCause = async () => {
    if (!nomCause) {
      setNomCauseError("Le nom de la cause est requis");
      return;
    }

    // Vérifier si le nom de la cause existe déjà
    const existingCause = causes.find((cause) => cause.libelle === nomCause);
    if (existingCause) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Le nom de la cause existe déjà");
      setSnackbarOpen(true);
      return;
    }
    console.log(existingCause, "eee");
    try {
      await causeService.addCause({ libelle: nomCause });
      loadCauses();
      setNomCause("");
      setSnackbarSeverity("success");
      setSnackbarMessage("La cause a été ajoutée avec succès");
      setSnackbarOpen(true);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding cause:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout de la cause");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteCause = async (code) => {
    try {
      await causeService.deleteCause(code);
      loadCauses();
      setSnackbarSeverity("success");
      setSnackbarMessage("La cause a été supprimée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting cause:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression de la cause");
      setSnackbarOpen(true);
    }
  };

  const handleEditCause = (cause) => {
    setEditCodeCause(cause.codeCause);
    setNomCause(cause.libelle);
    setOpenDialog(true);
  };

  const handleUpdateCause = async () => {
    if (!nomCause) {
      setNomCauseError("Le nom de la cause est requis");
      return;
    }
    try {
      await causeService.updateCause({
        codeCause: editCodeCause,
        libelle: nomCause,
      });
      loadCauses();
      clearForm();
      setOpenDialog(false);
      setSnackbarSeverity("success");
      setSnackbarMessage("La cause a été mise à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating cause:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour de la cause");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearForm();
  };

  const clearForm = () => {
    setEditCodeCause(null);
    setNomCause("");
    setNomCauseError("");
  };

  const handleNomCauseChange = (e) => {
    setNomCause(e.target.value);
    setNomCauseError(""); // Réinitialiser l'erreur quand l'utilisateur commence à écrire
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCauses = causes.filter((cause) =>
    cause.libelle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box component="main" sx={{ minHeight: "calc(100vh - 64px)" }}>
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
          sx={{ fontWeight: 500 }}
        >
          Causes
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
          Ajouter une cause
        </Button>
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
          minHeight: 400,
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.main,
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
                Liste des causes
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
        <Grid container spacing={1}>
          {filteredCauses.map((cause) => (
            <Grid item xs={12} sm={6} md={4} key={cause.codeCause}>
              <Card
                sx={{
                  backgroundColor:
                    theme.palette.mode === "light" ? "#f3f8fb" : "#292929",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                  marginLeft: "20px",
                  marginBottom: "16px",
                  transition: "transform 0.2s ease-in-out",
                  width: "auto",
                  border: "none",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {cause.libelle}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton onClick={() => handleEditCause(cause)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteCause(cause.codeCause)}
                  >
                    <DeleteIcon />
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
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          style={{
            color: theme.palette.mode === "light" ? "#5c99c7" : "#f6f7f9",
          }}
        >
          {editCodeCause ? "Modifier la cause" : "Ajouter une cause"}
        </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 1 }}
            autoFocus
            label="Nom de la cause"
            value={nomCause}
            onChange={handleNomCauseChange}
            fullWidth
            error={!!nomCauseError}
            helperText={nomCauseError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={editCodeCause ? handleUpdateCause : handleAddCause}>
            {editCodeCause ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartementPage;
