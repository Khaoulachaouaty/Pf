import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
  Box,
  Avatar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Block, Search, Add, Clear } from "@mui/icons-material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { demandeurService } from "../../services/demandeur_service";
import { userService } from "../../services/user_service";
import { imageService } from "../../services/image_service";
import { format } from "date-fns";

const Demandeur = () => {
  const theme = useTheme();
  const [dataRows, setDataRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSociete, setSelectedSociete] = useState("");
  const [societes, setSocietes] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    // Effectue une requête GET vers votre API pour obtenir les demandeurs
    demandeurService
      .getDemandeurs()
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

        // Extraire les noms des sociétés pour le menu déroulant
        const uniqueSocietes = [
          ...new Set(updatedDataRows.map((item) => item.nomSociete)),
        ];
        setSocietes(uniqueSocietes);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Filtrer les données en fonction des critères de recherche et de filtrage
    const filtered = dataRows.filter((row) => {
      return (
        (selectedSociete === "" || row.nomSociete === selectedSociete) &&
        (searchTerm === "" ||
          (row.nom + " " + row.prenom)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredRows(filtered);
  }, [searchTerm, selectedSociete, dataRows]);

  const handleDeleteRow = (rowId) => {
    const userToDelete = dataRows.find((user) => user.id === rowId);
    console.log(userToDelete, ";;;;;;;;;;;");

    if (userToDelete) {
      setSelectedRowId(userToDelete.id);
      setOpenConfirmationDialog(true);
    } else {
      console.error("User not found with ID:", rowId);
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedRowId) {
      console.log(selectedRowId, "ssssssss");
      console.error("No user selected for deletion.");
      return;
    }

    userService
      .deleteUser(selectedRowId)
      .then((response) => {
        const updatedRows = dataRows.filter(
          (user) => user.id !== selectedRowId
        );
        setDataRows(updatedRows);
        setFilteredRows(updatedRows);
        console.log("User deleted successfully.", response.data);
      })
      .catch((error) => {
        console.error("Error deleting user from database:", error);
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
      field: "sexe",
      headerName: "Sexe",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => <span>{row.sexe}</span>,
    },
    {
      field: "tel",
      headerName: "Téléphone",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => <span>{row.tel}</span>,
    },
    {
      field: "post",
      headerName: "Post",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nomSociete",
      headerName: "Société",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => <span>{row.nomSociete}</span>,
    },
    {
      field: "dateNaiss",
      headerName: "Date de naissance",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>
          {row.dateNaiss
            ? format(new Date(row.dateNaiss), "dd, MMM, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Block
          color="error"
          onClick={() => handleDeleteRow(row.id)}
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
        <Button
          component={Link}
          to="/admin/ajout_demandeur"
          variant="outlined"
          startIcon={<Add />}
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            "&:hover": {
              color: theme.palette.secondary.main,
              borderColor: theme.palette.secondary.main,
            },
            marginLeft: "auto",
          }}
        >
          Ajouter
        </Button>
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
                Gestion de demandeurs
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>

              <FormControl variant="outlined" size="small" sx={{ width: 250 }}>
                <InputLabel>Société</InputLabel>
                <Select
                  value={selectedSociete}
                  onChange={(e) => setSelectedSociete(e.target.value)}
                  label="Société"
                  endAdornment={
                    selectedSociete && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSelectedSociete("")}
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                >
                  <MenuItem value="">Tout</MenuItem>
                  {societes.map((societe, index) => (
                    <MenuItem key={index} value={societe}>
                      {societe}
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
          subTitle=""
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
    </Box>
  );
};

export default Demandeur;
