import { DataGrid } from "@mui/x-data-grid";
import { IconButton, InputAdornment, TextField, useTheme } from "@mui/material";
import { Box, Button } from "@mui/material";
import {
  Add,
  Block,
  Clear,
  DomainAdd,
  Search, // Ajout de l'icône Search
} from "@mui/icons-material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { clientService } from "../../services/client_service";
import { Link } from "react-router-dom";

const Client = () => {
  const theme = useTheme();
  const [dataRows, setDataRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    // Effectue une requête GET vers votre API
    clientService
      .getAllClients()
      .then((response) => {
        // Ajouter un identifiant unique à chaque objet dans les données
        console.log("response", response.data);
        const updatedDataRows = response.data.map((item) => ({
          ...item,
          id: item.codeClient, // Utiliser le nom correct de l'ID de la base de données
        }));
        // Met à jour l'état avec les données reçues
        setDataRows(updatedDataRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDeleteRow = (rowId) => {
    // Trouver l'utilisateur correspondant à l'ID
    const clientToDelete = dataRows.find((client) => client.codeClient === rowId);
    if (clientToDelete) {
      // Afficher la boîte de dialogue de confirmation
      setSelectedRowId(clientToDelete.codeClient); // Utiliser l'ID de la base de données
      setOpenConfirmationDialog(true);
    } else {
      console.error("Client not found with ID:", rowId);
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedRowId) {
      console.error("No client selected for deletion.");
      return;
    }

    // Supprimer l'utilisateur de la base de données
    clientService
      .deleteClient(selectedRowId)
      .then((response) => {
        console.log("Client deleted from database:", response.data);

        // Enlever l'utilisateur du tableau
        const updatedRows = dataRows.filter(
          (client) => client.codeClient !== selectedRowId
        );
        setDataRows(updatedRows);

        // Afficher un message de confirmation
        console.log("Client deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting client from database:", error);
        // Afficher un message d'erreur
        console.error("Failed to delete client.");
      });

    setOpenConfirmationDialog(false);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const filteredRows = dataRows.filter((row) =>
    row.nomSociete.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      field: "codeClient",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nomSociete",
      headerName: "Nom",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "emailSociete",
      headerName: "Adresse mail",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "adresse",
      headerName: "Adresse",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ville",
      headerName: "Ville",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "codePostal",
      headerName: "Code postal",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tel",
      headerName: "Téléphone",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dateEntree",
      headerName: "Date d'entrée",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(
          date
        );
        return formattedDate;
      },
    },
    {
      field: "Delete", // Nouvelle colonne pour l'icône Delete
      headerName: "", // Vous pouvez laisser vide si vous ne voulez pas de texte dans l'en-tête
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Block
          color="error"
          onClick={() => handleDeleteRow(row.id)} // Passer l'ID de l'utilisateur à la fonction handleDeleteRow
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
      >
        <Button
          component={Link}
          startIcon={<Add />}
          to="/admin/ajout_client"
          variant="outlined"
          sx={{
            color:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.main,

            borderColor:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.main,

            "&:hover": {
              color:
                theme.palette.mode === "light"
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.main,
              borderColor:
                theme.palette.mode === "light"
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.main,
            },
            marginLeft: "auto", // Alignement à droite
          }}
        >
          Ajouter
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
<Header
  title={
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Pour aligner les éléments de chaque côté
        gap: "8px",
        fontSize: "24px",
        fontWeight: "bold",
        color: theme.palette.primary.main, // Utilisation de la couleur principale du thème
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <DomainAdd />
        Gestion des Sociétés
      </Box>
      <TextField
        label="Rechercher par nom"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginRight: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchTerm("")}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  }
  subTitle=""
/>


        <Box sx={{ height: 600, mx: "auto" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
          />
        </Box>
      </Box>
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet élément ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Client;
