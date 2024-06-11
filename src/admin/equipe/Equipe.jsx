import { DataGrid } from "@mui/x-data-grid";
import { IconButton, InputAdornment, useTheme } from "@mui/material";
import {
  Box,
  Avatar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Block, Search, Clear, Edit } from "@mui/icons-material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { technicienService } from "../../services/technicien_service";
import { userService } from "../../services/user_service";
import { imageService } from "../../services/image_service";
import { format } from "date-fns";

const Technicien = () => {
  const theme = useTheme();
  const [dataRows, setDataRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartement, setSelectedDepartement] = useState("");
  const [departs, setDeparts] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    // Effectue une requête GET vers votre API pour obtenir les demandeurs
    technicienService
      .getTechniciens()
      .then(async (response) => {
        const updatedDataRows = await Promise.all(
          response.data.map(async (item) => {
            let avatarUrl = "";
            if (item.imageId) {
              try {
                const imageResponse = await imageService.getImage(item.imageId);
                avatarUrl = `data:image/png;base64,${imageResponse.data.image}`;
              } catch (error) {
                console.error("Error fetching image:", error);
              }
            }
            return {
              ...item,
              id: item.id,
              avatarUrl,
            };
          })
        );
        setDataRows(updatedDataRows);
        setFilteredRows(updatedDataRows);

        // Extraire les noms des départements pour le menu déroulant
        const uniqueDeparts = [
          ...new Set(updatedDataRows.map((item) => item.nomDepart)),
        ];
        setDeparts(uniqueDeparts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Filtrer les données en fonction des critères de recherche et de filtrage
    const filtered = dataRows.filter((row) => {
      return (
        (selectedDepartement === "" || row.nomDepart === selectedDepartement) &&
        (searchTerm === "" ||
          (row.nom + " " + row.prenom)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredRows(filtered);
  }, [searchTerm, selectedDepartement, dataRows]);

  const handleDeleteRow = (rowId) => {
    const userToDelete = dataRows.find((user) => user.id === rowId);
    if (userToDelete) {
      setSelectedRowId(userToDelete.id);
      setOpenConfirmationDialog(true);
    } else {
      console.error("User not found with ID:", rowId);
    }
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
const [selectedTechnicien, setSelectedTechnicien] = useState(null);

const handleEditResponsable = (technicien) => {
  setSelectedTechnicien(technicien);
  setOpenEditDialog(true);
};

const handleCloseEditDialog = () => {
  setOpenEditDialog(false);
  setSelectedTechnicien(null);
};

const handleSaveResponsable = () => {
  if (selectedTechnicien) {
    const updatedResponsable = selectedTechnicien.responsable === "O" ? "N" : "O";
    technicienService.updateResponsable(selectedTechnicien.codeTechnicien, updatedResponsable)
      .then(() => {
        // Update the local state with the new responsable value
        const updatedRows = dataRows.map(row => 
          row.id === selectedTechnicien.id ? { ...row, responsable: updatedResponsable } : row
        );
        setDataRows(updatedRows);
        setFilteredRows(updatedRows);
        handleCloseEditDialog();
      })
      .catch(error => {
        console.error("Error updating responsable status:", error);
      });
  }
};

  const handleConfirmDelete = () => {
    if (!selectedRowId) {
      console.error("No user selected for deletion.");
      return;
    }
    console.log(selectedRowId);
    userService
      .deleteUser(selectedRowId)
      .then(() => {
        const updatedRows = dataRows.filter(
          (user) => user.id !== selectedRowId
        );
        setDataRows(updatedRows);
        setFilteredRows(updatedRows);
        console.log("User deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting user from database:", error);
        console.error("Failed to delete user.");
      });

    setOpenConfirmationDialog(false);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const columns = [
    {
      field: "nom",
      headerName: "Nom complet",
      flex: 2,
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={row.avatarUrl}
            alt={`${row.nom} ${row.prenom}`}
            style={{ marginRight: 8 }}
          />
          {row.nom} {row.prenom}
        </span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      headerAlign: "center",
      renderCell: ({ row }) => <span>{row.email}</span>,
    },
    {
      field: "user.sexe",
      headerName: "Sexe",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.sexe}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "user.tel",
      headerName: "Téléphone",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.tel}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "user.cin",
      headerName: "Carte d'identité",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.cin}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "Date de naissance",
      headerName: "Date de naissance",
      align: "center",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{format(new Date(row.dateNaiss), "dd, MMM, yyyy")}</span>
      ),
    },
    {
      field: "responsable",
      headerName: "Responsable",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>
          {row.responsable === "N" ? "Non" : row.responsable === "O" ? "Oui" : "-"}
          <IconButton onClick={() => handleEditResponsable(row)}>
            <Edit />
          </IconButton>
        </span>
      ),
    },
    {
      field: "nomDepart",
      headerName: "Departement",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => <span>{row.nomDepart}</span>,
    },
    {
      field: "dateEmbauche",
      headerName: "Date d'embauche",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{format(new Date(row.dateEmbauche), "dd, MMM, yyyy")}</span>
      ),
    },
    {
      field: "Delete", // Nouvelle colonne pour l'icône Delete
      headerName: "Action", // Vous pouvez laisser vide si vous ne voulez pas de texte dans l'en-tête
      //flex: 1,
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
    <Box sx={{ maxWidth: "100%", margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
          alignItems: "center",
        }}
      >
        {/* <Button
          component={Link}
          to="/admin/ajout_employees"
          variant="outlined"
          startIcon={<Add />}
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            "&:hover": {
              color: theme.palette.secondary.main,
              borderColor: theme.palette.secondary.main,
            },
            marginLeft: 2,
          }}
        >
          Ajouter
        </Button> */}
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
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
                gap: "8px",
                fontSize: "24px",
                fontWeight: "bold",
                justifyContent: "space-between",
                color: theme.palette.primary.main,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <PeopleOutlinedIcon />
                Gestion de Techniciens
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ width: 250 }}
                >
                  <InputLabel>Département</InputLabel>
                  <Select
                    value={selectedDepartement}
                    onChange={(e) => setSelectedDepartement(e.target.value)}
                    label="Département"
                    endAdornment={
                      selectedDepartement && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedDepartement("")}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  >
                    <MenuItem value="">Tout</MenuItem>
                    {departs.map((depart, index) => (
                      <MenuItem key={index} value={depart}>
                        {depart}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm("")}
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          }
        />

        <Box sx={{ height: 600, mx: "auto" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                fontSize: "16px",
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.default,
              },
            }}
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
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
      <DialogTitle>Modifier Responsable</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir modifier le statut de responsable <br/>pour {selectedTechnicien?.prenom} {selectedTechnicien?.nom} ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditDialog} color="primary">
          Non
        </Button>
        <Button onClick={handleSaveResponsable} color="primary">
          Oui
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default Technicien;
