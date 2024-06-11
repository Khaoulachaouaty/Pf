import { useEffect, useState } from "react";
import {
  Typography,
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
  Button,
  Snackbar,
  Alert,
  useTheme,
  TextField,
  Stack,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { articleService } from "./../../services/article_service";
import BarChart from "./barChart";

const Row2 = () => {
  const theme = useTheme();

  const [articles, setArticles] = useState([]);
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
      setArticles(response.data.filter((article) => article.qteArticle <= 10));
    } catch (error) {
      console.error("Error fetching articles data:", error);
    }
  };

  const clearForm = () => {
    setNewQuantity(0);
  };

  const handleEditArticle = (article) => {
    setEditId(article.codeArticle);
    setQte(article.qteArticle);
    setUpdateDialogOpen(true);
  };

  const handleUpdateArticle = async (event) => {
    event.preventDefault();
    try {
      await articleService.updateArticleQte(editId, qte + newQuantity);
      clearForm();
      setUpdateDialogOpen(false);
      loadArticles();
      handleUpdateSnackbarOpen();
    } catch (error) {
      console.error("Error updating article:", error);
      setUpdateDialogOpen(false);
      clearForm();
    }
  };

  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    clearForm();
  };

  const handleUpdateSnackbarOpen = () => {
    setSnackbarMessage(
      "La quantité de l'article a été mise à jour avec succès."
    );
    setUpdateSnackbarOpen(true);
  };

  return (
    <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3} height="400px" width="100%">
      <Paper sx={{flexGrow:1, height:"400px"}}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box sx={{ width: "100%", flexGrow: 1, mr: 2}}>
            <Typography
              color={theme.palette.secondary.main}
              fontWeight={"bold"}
              p={1.2}
              variant="h6"
              ml={2}
              mt={1}
            >
              Les articles les plus utilisés
            </Typography>
            <BarChart />
          </Box>
        </Stack>
      </Paper>
      
      <Paper sx={{ flexGrow: 1, height:"400px" }}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box sx={{
          overflow: "auto",
          borderRadius: "4px",
          width: "100%",
          height: "400px",
          flexGrow: 1,
        }}>
          <Typography
            color={theme.palette.secondary.main}
            fontWeight={"bold"}
            p={1.2}
            variant="h6"
            ml={2}
            mt={1}
          >
            Liste des articles en repture de stock
          </Typography>

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
                {articles.map((article) => (
                  <TableRow key={article.codeArticle}>
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
                      onChange={(e) =>
                        setNewQuantity(parseFloat(e.target.value))
                      }
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
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Row2;
