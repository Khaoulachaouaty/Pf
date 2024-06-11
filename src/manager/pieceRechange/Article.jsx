import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  IconButton,
  InputAdornment,
  useTheme,
  Snackbar,
  Alert,
  styled,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { articleService } from "../../services/article_service";

const ArticlesPage = () => {
  const theme = useTheme();

  const [articles, setArticles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteArticle, setDeleteArticle] = useState(null);

  const [nomError, setNomError] = useState("");
  const [marqueError, setMarqueError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [nom, setNom] = useState("");
  const [marque, setMarque] = useState("");
  const [qte, setQte] = useState(0);

  const [addSnackbarOpen, setAddSnackbarOpen] = useState(false);
  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);

  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    //marginTop: theme.spacing(3),
    boxShadow: theme.shadows[3],
  }));
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#6e9fc3" : "#323648",
    color: theme.palette.common.white,
    fontWeight: 'bold',
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  }));

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await articleService.getAllArticles();
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdd = async () => {
    event.preventDefault();
    let isValid = true;
    if (!nom) {
      setNomError("Le nom est requis");
      isValid = false;
    }
    if (!marque) {
      setMarqueError("La marque est requise");
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    const existingArticle = articles.find(
      (article) =>
        article.nomArticle.toLowerCase() === nom.toLowerCase() &&
        article.marqueArticle.toLowerCase() === marque.toLowerCase()
    );

    if (existingArticle) {
      setSnackbarMessage(
        "Un article avec le même nom et la même marque existe déjà."
      );
      setSnackbarOpen(true);
      return;
    }

    const article = {
      nomArticle: nom,
      marqueArticle: marque,
      qteArticle: qte,
    };
    try {
      await articleService.addArticle(article);
      clearForm();
      setDialogOpen(false);
      loadArticles();
      handleAddSnackbarOpen();
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const clearForm = () => {
    setNom("");
    setMarque("");
    setQte(0);
  };

  const handleNomChange = (e) => {
    setNom(e.target.value);
    setNomError("");
  };

  const handleMarqueChange = (e) => {
    setMarque(e.target.value);
    setMarqueError("");
  };

  const openDialog = (mode) => {
    setDialogMode(mode);
    setFormSubmitted(false);
    setDialogOpen(true);
    setNomError("");
    setMarqueError("");
  };

  const closeDialog = () => {
    setDialogOpen(false);
    clearForm();
  };

  const handleDelete = async (code) => {
    try {
      await articleService.deleteArticle(code);
      loadArticles();
      handleDeleteSnackbarOpen();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleAddSnackbarOpen = () => {
    setSnackbarMessage("L'article a été ajouté avec succès.");
    setAddSnackbarOpen(true);
  };

  const handleDeleteSnackbarOpen = () => {
    setSnackbarMessage("L'article a été supprimé avec succès.");
    setDeleteSnackbarOpen(true);
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
          Articles
        </Typography>
        <Button
          onClick={() => openDialog("add")}
          variant="contained"
          sx={{
            backgroundColor:
            theme.palette.mode === "light" ? "#6e9fc3" : "#323648",
          color: theme.palette.mode === "light" ? "#fff" : "#fff",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light" ? "#6490b9" : "#1b1d27",
          },
          }}
          startIcon={<AddIcon />}
        >
          Ajouter un article
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="Rechercher par nom"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchInputChange}
              fullWidth
              size="small"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={() => setSearchTerm("")}
                      edge="end"
                    >
                      {searchTerm && <ClearIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: "300px" }}
            />
          </Box>
        </Box>

        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Nom</StyledTableCell>
                <StyledTableCell align="center">Marque</StyledTableCell>
                <StyledTableCell align="center">Quantité</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles
                .filter((article) => {
                  if (searchTerm === "") {
                    return true;
                  } else {
                    return article.nomArticle
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  }
                })
                .map((article) => (
                  <TableRow key={article.id}>
                    <TableCell align="center">{article.nomArticle}</TableCell>
                    <TableCell align="center">
                      {article.marqueArticle}
                    </TableCell>
                    <TableCell align="center">{article.qteArticle}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => setDeleteArticle(article.codeArticle)}
                        aria-label="supprimer"
                        sx={{
                          color:
                            theme.palette.mode === "light" ? "#6e9fc3" : "#d0e3ed",
                          "&:hover": {
                            color:
                              theme.palette.mode === "light"
                                ? "#5b89b5"
                                : "#b0d0e0",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Ajouter un article</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <Grid container spacing={2}>
              <Grid item xs={12} my={1}>
                <TextField
                  fullWidth
                  label="Nom"
                  variant="outlined"
                  error={!!nomError}
                  helperText={marqueError}
                  value={nom}
                  onChange={handleNomChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Marque"
                  variant="outlined"
                  error={!!marqueError}
                  helperText={marqueError}
                  value={marque}
                  onChange={handleMarqueChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantité"
                  variant="outlined"
                  type="number"
                  value={qte}
                  onChange={(e) => setQte(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid
                item
                xs={12}
                container
                justifyContent="flex-end"
                spacing={2}
              >
                <Grid item>
                  <Button
                    onClick={closeDialog}
                    variant="outlined"
                    color="secondary"
                  >
                    Annuler
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Ajouter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteArticle} onClose={() => setDeleteArticle(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet article ?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteArticle(null)}
            sx={{
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              borderColor: undefined,
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              handleDelete(deleteArticle);
              setDeleteArticle(null);
            }}
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#d10404" : "#d10404",
              color: theme.palette.mode === "light" ? "#fff" : "#fff",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "#ac0808" : "#ac0808",
              },
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={addSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setAddSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setAddSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={updateSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setUpdateSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setUpdateSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={deleteSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setDeleteSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setDeleteSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticlesPage;
