import { useEffect, useState } from "react";
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
  IconButton,
  InputAdornment,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { articleService } from "./../services/article_service";

const ArticlesPage = () => {
  const theme = useTheme();

  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [qte, setQte] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);

  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false);

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

  const clearForm = () => {
    setNewQuantity(0); 
  };

  const handleEditArticle = (article) => {
    setEditId(article.codeArticle);
    setQte(article.qteArticle);
    setUpdateDialogOpen(true);
  };

  const handleUpdateArticle = async () => {
    event.preventDefault();
    try {
      await articleService.updateArticleQte(editId, qte+newQuantity);
      clearForm();
      setUpdateDialogOpen(false);
      loadArticles();
      handleUpdateSnackbarOpen();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    clearForm();
  };

  const handleUpdateSnackbarOpen = () => {
    setSnackbarMessage("La quantité de l'article a été mise à jour avec succès.");
    setUpdateSnackbarOpen(true);
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Nom</TableCell>
                <TableCell align="center">Marque</TableCell>
                <TableCell align="center">Quantité</TableCell>
                <TableCell align="center">Action</TableCell>
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
                        onClick={() => handleEditArticle(article)}
                        aria-label="modifier"
                        sx={{
                          color:
                            theme.palette.mode === "light"
                              ? "#d64000"
                              : "#ffbb6b",
                          "&:hover": {
                            color:
                              theme.palette.mode === "light"
                                ? "#a33109"
                                : "#ff932f",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={updateDialogOpen} onClose={closeUpdateDialog}>
        <DialogTitle>Ajouter au stock</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateArticle}>
            <Grid container spacing={2}>
              <Grid item xs={12} my={1}>
                <TextField
                  fullWidth
                  label="Quantité"
                  variant="outlined"
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseFloat(e.target.value))}
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
                    onClick={closeUpdateDialog}
                    variant="outlined"
                    color="secondary"
                  >
                    Annuler
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Valider
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
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

    </Box>
  );
};

export default ArticlesPage;
