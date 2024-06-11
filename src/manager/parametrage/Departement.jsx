import React, { useState, useEffect } from 'react';
import { Button, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { departementService } from '../../services/departement_service';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DepartementPage = () => {
  const [departements, setDepartements] = useState([]);
  const [codeDepart, setCodeDepart] = useState('');
  const [nomDepart, setNomDepart] = useState('');
  const [editCodeDepart, setEditCodeDepart] = useState(null);
  const [deleteCodeDepart, setDeleteCodeDepart] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [nomDepartError, setNomDepartError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  useEffect(() => {
    loadDepartements();
  }, []);

  const loadDepartements = async () => {
    try {
      const response = await departementService.getAllDepartements();
      setDepartements(response.data);
    } catch (error) {
      console.error("Error fetching departements:", error);
    }
  };

  const handleAddDepartement = async () => {
    if (!nomDepart) {
      setNomDepartError("Le nom du département est requis");
      return;
    }

    // Vérifier si le nom du département existe déjà
    const existingDepartement = departements.find(departement => departement.nomDepart === nomDepart);
    if (existingDepartement) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Le nom du département existe déjà");
      setSnackbarOpen(true);
      return;
    }

    try {
      await departementService.addDepartement({ nomDepart });
      loadDepartements();
      setNomDepart('');
      setNomDepartError('');
      setSnackbarSeverity("success");
      setSnackbarMessage("Le département a été ajouté avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding departement:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout du département");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteDepartement = async () => {
    try {
      await departementService.deleteDepartement(deleteCodeDepart);
      setOpenDeleteDialog(false);
      setDeleteCodeDepart(null);
      loadDepartements();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le département a été supprimé avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting departement:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression du département");
      setSnackbarOpen(true);
    }
  };

  const handleEditDepartement = (codeDepart, nomDepart) => {
    setEditCodeDepart(codeDepart);
    setCodeDepart(codeDepart);
    setNomDepart(nomDepart);
  };

  const handleUpdateDepartement = async () => {
    if (!nomDepart) {
      setNomDepartError("Le nom du département est requis");
      return;
    }
    try {
      await departementService.updateDepartement({ codeDepart: editCodeDepart, nomDepart });
      loadDepartements();
      setEditCodeDepart(null);
      setCodeDepart('');
      setNomDepart('');
      setSnackbarSeverity("success");
      setSnackbarMessage("Le département a été mis à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating departement:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour du département");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDeleteDialog = (codeDepart) => {
    setOpenDeleteDialog(true);
    setDeleteCodeDepart(codeDepart);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteCodeDepart(null);
  };

  const handleNomDepartChange = (e) => {
    setNomDepart(e.target.value);
    setNomDepartError(''); // Réinitialiser l'erreur quand l'utilisateur commence à écrire
  };

  return (
    <div style={{ margin: '20px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>Gestion des Départements</Typography>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        <TextField
          label="Nom du département"
          value={nomDepart}
          onChange={handleNomDepartChange}
          error={!!nomDepartError}
          helperText={nomDepartError}
        />
        <Button variant="contained" onClick={editCodeDepart ? handleUpdateDepartement : handleAddDepartement}>
          {editCodeDepart ? "Modifier" : "Ajouter"}
        </Button>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Code</TableCell>
                <TableCell align="center">Nom</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departements.map(departement => (
                <TableRow key={departement.codeDepart}>
                  <TableCell align="center">{departement.codeDepart}</TableCell>
                  <TableCell align="center">{departement.nomDepart}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditDepartement(departement.codeDepart, departement.nomDepart)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(departement.codeDepart)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce département ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDeleteDepartement} color="error">Supprimer</Button>
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
    </div>
  );
};

export default DepartementPage;
