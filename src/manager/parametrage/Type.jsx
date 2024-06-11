import React, { useState, useEffect } from 'react';
import { Button, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Box, useTheme, InputAdornment, styled } from '@mui/material';
import { typeInterService } from '../../services/typeInter_service';
import EditIcon from '@mui/icons-material/Edit';
import {Delete as DeleteIcon, 
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import Header from '../components/Header';

const TypeInterPage = () => {
  const theme = useTheme();

  const [typesIntervention, setTypesIntervention] = useState([]);
  const [libelle, setLibelle] = useState('');
  const [description, setDescription] = useState('');
  const [duree, setDuree] = useState('');
  const [uniteDuree, setUniteDuree] = useState('');
  const [editId, setEditId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTypeCode, setDeleteTypeCode] = useState(null); 
  const [libelleError, setLibelleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dureeError, setDureeError] = useState('');
  const [uniteDureeError, setUniteDureeError] = useState('');
  const [unitOptions] = useState(['secondes', 'minutes', 'heures']);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const [searchTerm, setSearchTerm] = useState("");

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
    loadTypesIntervention();
  }, []);

  const loadTypesIntervention = async () => {
    try {
      const response = await typeInterService.getAllTypeInter();
      setTypesIntervention(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const handleAddTypeInter = async () => {
    let isValid = true;
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      isValid = false;
    }
    if (!description) {
      setDescriptionError("La description est requise");
      isValid = false;
    }
    if (!duree) {
      setDureeError("La durée est requise");
      isValid = false;
    }
    if (!uniteDuree) {
      setUniteDureeError("L'unité de durée est requise");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    const type = {
      libelleType: libelle,
      description: description,
      duree: duree,
      unitCodeDuree: uniteDuree,
    };
    try {
      await typeInterService.addTypeInter(type);
      clearForm();
      setOpenDialog(false);
      loadTypesIntervention();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le type d'intervention a été ajouté avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding type:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout du type d'intervention");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteTypeInter = async (code) => {
    try {
      await typeInterService.deleteTypeInter(code);
      loadTypesIntervention();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le type d'intervention a été supprimé avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting type:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression du type d'intervention");
      setSnackbarOpen(true);
    }
  };

  const handleEditTypeInter = (type) => {
    setEditId(type.codeType);
    setLibelle(type.libelleType);
    setDescription(type.description);
    setDuree(type.duree);
    setUniteDuree(type.unitCodeDuree);
    setOpenDialog(true);
  };

  const handleUpdateTypeInter = async (id) => {
    let isValid = true;
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      isValid = false;
    }
    if (!description) {
      setDescriptionError("La description est requise");
      isValid = false;
    }
    if (!duree) {
      setDureeError("La durée est requise");
      isValid = false;
    }
    if (!uniteDuree) {
      setUniteDureeError("L'unité de durée est requise");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    const type = {
      codeType: id,
      libelleType: libelle,
      description: description,
      duree: duree,
      unitCodeDuree: uniteDuree,
    };
    
    try {
      await typeInterService.updateTypeInter(type);
      clearForm();
      setOpenDialog(false);
      loadTypesIntervention();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le type d'intervention a été mis à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating type:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour du type d'intervention");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearForm();
  };

  const clearForm = () => {
    setEditId(null);
    setLibelle('');
    setDescription('');
    setDuree('');
    setUniteDuree('');
    setLibelleError('');
    setDescriptionError('');
    setDureeError('');
    setUniteDureeError('');
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLibelleChange = (e) => {
    setLibelle(e.target.value);
    setLibelleError(''); 
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setDescriptionError(''); 
  };

  const handleDureeChange = (e) => {
    setDuree(e.target.value);
    setDureeError(''); 
  };

  const handleUniteDureeChange = (e, value) => {
    setUniteDuree(value);
    setUniteDureeError(''); 
  };

  return (
    <Box  component="main"
    sx={{
      minHeight: "calc(100vh - 64px)",
    }}>
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
          Types
        </Typography>
        <Button
          onClick={() => setOpenDialog(true)}
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
          Ajouter un type
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
          <Box  sx={{
            backgroundColor: theme.palette.background.main,
            padding: "20px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
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
                Liste des types
              </Box>
            }
            subTitle=""
          />
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
       
     
 <StyledTableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell align="center">Libellé</StyledTableCell>
          <StyledTableCell align="center">Description</StyledTableCell>
          <StyledTableCell align="center">Durée</StyledTableCell>
          <StyledTableCell align="center">Actions</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {typesIntervention.filter(type => {
          if (searchTerm === "") {
            return true;
          } else {
            return type.libelleType
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
        }).map(type => (
          <StyledTableRow key={type.codeType}>
            <TableCell align="center">{type.libelleType}</TableCell>
            <TableCell align="center">{type.description}</TableCell>
            <TableCell align="center">{type.duree} {type.unitCodeDuree}</TableCell>
            <TableCell align="center">
              <IconButton onClick={() => handleEditTypeInter(type)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setDeleteTypeCode(type.codeType)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </StyledTableContainer>
      

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editId ? "Modifier le Type d'Intervention" : "Ajouter un Type d'Intervention"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Libellé"
                value={libelle}
                onChange={handleLibelleChange}
                fullWidth
                error={!!libelleError}
                helperText={libelleError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                error={!!descriptionError}
                helperText={descriptionError}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Durée"
                value={duree}
                onChange={handleDureeChange}
                fullWidth
                error={!!dureeError}
                helperText={dureeError}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={unitOptions}
                value={uniteDuree}
                onChange={handleUniteDureeChange}
                renderInput={(params) => <TextField {...params} label="Unité de durée" fullWidth />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={editId ? () => handleUpdateTypeInter(editId) : handleAddTypeInter}>{editId ? "Modifier" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTypeCode} onClose={() => setDeleteTypeCode(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce type d'intervention ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTypeCode(null)}>Annuler</Button>
          <Button onClick={() => {
            handleDeleteTypeInter(deleteTypeCode);
            setDeleteTypeCode(null);
          }}color="error">Confirmer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
};

export default TypeInterPage;
